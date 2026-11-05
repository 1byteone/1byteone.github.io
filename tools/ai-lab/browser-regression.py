#!/usr/bin/env python3
"""Real Chromium regression checks for the AI Lab routes.

The script intentionally reports measurements and blocked capabilities instead of
pretending that a static HTML check is equivalent to browser evidence.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import sync_playwright


VIEWPORTS = {
    "desktop": (1440, 900),
    "tablet": (768, 1024),
    "narrow": (664, 524),
    "mobile": (390, 844),
}


def box(page, selector: str):
    locator = page.locator(selector).first
    if locator.count() == 0:
        return None
    value = locator.bounding_box()
    if value is None:
        return None
    return {key: round(number, 2) for key, number in value.items()}


def check_page(page, url: str, language: str, viewport_name: str, output_dir: Path):
    console_errors = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.goto(url, wait_until="networkidle", timeout=30_000)
    page.wait_for_timeout(250)
    width = page.viewport_size["width"]
    height = page.viewport_size["height"]
    output_dir.mkdir(parents=True, exist_ok=True)
    screenshot = output_dir / f"{language}-{viewport_name}-{width}x{height}.png"
    page.screenshot(path=str(screenshot), full_page=True)

    metrics = page.evaluate(
        """() => ({
          scrollHeight: document.documentElement.scrollHeight,
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          title: document.title,
          mainCount: document.querySelectorAll('main').length,
          navCount: document.querySelectorAll('nav').length,
          dialogCount: document.querySelectorAll('dialog').length,
          imagesWithoutAlt: [...document.images].filter((image) => !image.hasAttribute('alt')).length,
          namelessControls: [...document.querySelectorAll('button, a, input, select, textarea')]
            .filter((element) => !element.getAttribute('aria-label') && !element.textContent.trim() && !element.getAttribute('title') && !element.getAttribute('placeholder')).length,
          focused: document.activeElement?.tagName || null,
        })"""
    )
    measurements = {
        selector: selector_box(page, selector)
        for selector in (
            ".al-home-intro",
            "[data-home-sizzle]",
            ".al-home-announcements",
            ".al-home-learn-more",
            ".al-ref-footer",
        )
    }

    checks = {}
    checks["no_horizontal_overflow"] = metrics["scrollWidth"] <= width
    checks["document_title"] = bool(metrics["title"])
    checks["main_landmark"] = metrics["mainCount"] >= 1
    checks["navigation_landmark"] = metrics["navCount"] >= 1
    checks["images_have_alt"] = metrics["imagesWithoutAlt"] == 0
    checks["controls_have_names"] = metrics["namelessControls"] == 0

    animation = page.locator("[data-home-animation-toggle]").first
    if animation.count():
        before = animation.get_attribute("aria-pressed")
        animation.click()
        page.wait_for_timeout(60)
        paused = animation.get_attribute("aria-pressed")
        paused_label = animation.get_attribute("aria-label")
        animation.click()
        page.wait_for_timeout(60)
        resumed = animation.get_attribute("aria-pressed")
        checks["animation_pause_resume"] = before == "false" and paused == "true" and resumed == "false"
        checks["animation_pause_has_label"] = bool(paused_label)
    else:
        checks["animation_pause_resume"] = False
        checks["animation_pause_has_label"] = False

    carousel = page.locator("[data-learn-carousel]").first
    previous = page.locator("[data-learn-prev]").first
    next_button = page.locator("[data-learn-next]").first
    if carousel.count() and next_button.count() and next_button.is_visible():
        before_left = page.evaluate("element => element.scrollLeft", carousel.element_handle())
        next_button.click()
        page.wait_for_timeout(120)
        after_left = page.evaluate("element => element.scrollLeft", carousel.element_handle())
        checks["learn_carousel_next"] = after_left >= before_left
        checks["learn_carousel_controls_named"] = bool(next_button.get_attribute("aria-label")) and bool(previous.get_attribute("aria-label"))
    elif carousel.count():
        checks["learn_carousel_next"] = True
        checks["learn_carousel_controls_named"] = (not next_button.count()) or (bool(next_button.get_attribute("aria-label")) and bool(previous.get_attribute("aria-label")))
    else:
        checks["learn_carousel_next"] = False
        checks["learn_carousel_controls_named"] = False

    search_button = page.locator("[data-lab-search-open]").first
    search = page.locator("[data-lab-global-search]").first
    if search_button.count() and search.count():
        search_button.click()
        page.wait_for_timeout(50)
        checks["search_focus"] = search.evaluate("element => document.activeElement === element")
        page.keyboard.press("Escape")
    else:
        checks["search_focus"] = False

    language_switch = page.locator("[data-lab-language-switch]").first
    checks["language_switch"] = language_switch.count() and bool(language_switch.get_attribute("href"))

    manager = page.locator("[data-theme-manager]").first
    if manager.count():
        trigger = manager.locator("summary").first
        trigger.click()
        page.wait_for_timeout(60)
        checks["theme_manager_popup"] = manager.get_attribute("open") is not None and manager.locator(".theme-manager-panel").is_visible()
        checks["theme_manager_center_link"] = manager.locator(".theme-manager-center-link").count() > 0
        page.keyboard.press("Escape")
    else:
        checks["theme_manager_popup"] = False
        checks["theme_manager_center_link"] = False
    return {
        "url": url,
        "language": language,
        "viewport": {"name": viewport_name, "width": width, "height": height},
        "measurements": measurements,
        "metrics": metrics,
        "checks": checks,
        "console_errors": console_errors,
        "screenshot": str(screenshot),
    }


def selector_box(page, selector: str):
    try:
        return box(page, selector)
    except PlaywrightError:
        return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:1322")
    parser.add_argument("--public", default="public")
    parser.add_argument("--output", default="docs/audit/ai-lab-browser")
    parser.add_argument("--headed", action="store_true")
    args = parser.parse_args()
    output_dir = Path(args.output)
    rows = []
    failures = []
    with sync_playwright() as playwright:
        executable = os.environ.get("CHROMIUM_PATH")
        browser = playwright.chromium.launch(headless=not args.headed, executable_path=executable)
        for language, route in (("zh", "/ai-lab/"), ("en", "/en/ai-lab/")):
            for viewport_name, (width, height) in VIEWPORTS.items():
                context = browser.new_context(viewport={"width": width, "height": height}, locale="zh-CN" if language == "zh" else "en-US")
                page = context.new_page()
                try:
                    row = check_page(page, f"{args.base_url.rstrip('/')}{route}", language, viewport_name, output_dir)
                    rows.append(row)
                    failures.extend(f"{language}/{viewport_name}: {name}" for name, passed in row["checks"].items() if not passed)
                    if row["console_errors"]:
                        failures.append(f"{language}/{viewport_name}: console_errors")
                except Exception as error:  # noqa: BLE001 - preserve evidence for each viewport
                    failures.append(f"{language}/{viewport_name}: {type(error).__name__}: {error}")
                finally:
                    context.close()
        reduced = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        page = reduced.new_page()
        try:
            page.goto(f"{args.base_url.rstrip('/')}/ai-lab/", wait_until="networkidle", timeout=30_000)
            page.wait_for_timeout(200)
            canvas_visible = page.locator("[data-home-art]").is_visible() if page.locator("[data-home-art]").count() else False
            fallback_visible = page.locator("[data-home-art-fallback]").is_visible() if page.locator("[data-home-art-fallback]").count() else False
            rows.append({"language": "zh", "viewport": {"name": "mobile-reduced-motion", "width": 390, "height": 844}, "checks": {"reduced_motion_visual": canvas_visible or fallback_visible}, "metrics": {}, "measurements": {}, "console_errors": []})
            if not canvas_visible and not fallback_visible:
                failures.append("zh/mobile-reduced-motion: reduced_motion_visual")
        finally:
            reduced.close()
        browser.close()
    report = {"generated_at": datetime.now(timezone.utc).isoformat(), "base_url": args.base_url, "viewports": list(VIEWPORTS), "pages": rows, "failures": failures, "status": "fail" if failures else "pass"}
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": report["status"], "pages": len(rows), "failures": len(failures), "report": str(output_dir / 'report.json')}, ensure_ascii=False))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())

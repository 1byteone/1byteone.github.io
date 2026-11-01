# Cyberpunk UI region candidate analysis

This detector produces candidate bounding boxes, not guaranteed independent UI components. Intersecting boxes are grouped into overlap clusters and require manual review before a crop is called reusable.

| Atlas | Source | Size | Candidate boxes | Overlap pairs | Spatial clusters | Map |
| --- | --- | --- | ---: | --- |
| `icons` | `icons-symbol-sheet.png` | `2048x1365` | **61** | 10 | 51 | `icons-regions.png` |
| `vertical` | `hud-vertical-sheet.png` | `1024x1480` | **62** | 3 | 59 | `vertical-regions.png` |
| `wide` | `hud-wide-sheet.png` | `2800x1387` | **20** | 0 | 20 | `wide-regions.png` |

## Region records

Each crop lives under `ui/regions/<atlas>/region-###.png`. Boxes in one overlap cluster are not counted as independent regions.

### icons (61 candidate boxes, 51 spatial clusters)

| ID | Cluster | Bbox | Mask area | Crop |
| --- | --- | --- | ---: | --- |
| `region-001` | `cluster-001` (1 boxes) | `x=244, y=68, w=135, h=128` | 12701 | `icons/region-001.png` |
| `region-002` | `cluster-002` (2 boxes) | `x=389, y=68, w=597, h=112` | 57915 | `icons/region-002.png` |
| `region-003` | `cluster-003` (1 boxes) | `x=1052, y=68, w=40, h=39` | 970 | `icons/region-003.png` |
| `region-004` | `cluster-004` (3 boxes) | `x=1124, y=68, w=208, h=208` | 22274 | `icons/region-004.png` |
| `region-005` | `cluster-005` (1 boxes) | `x=1367, y=68, w=109, h=256` | 21621 | `icons/region-005.png` |
| `region-006` | `cluster-006` (1 boxes) | `x=1644, y=68, w=120, h=280` | 19370 | `icons/region-006.png` |
| `region-007` | `cluster-007` (1 boxes) | `x=1798, y=68, w=46, h=46` | 1404 | `icons/region-007.png` |
| `region-008` | `cluster-008` (1 boxes) | `x=1908, y=68, w=45, h=45` | 1353 | `icons/region-008.png` |
| `region-009` | `cluster-009` (1 boxes) | `x=84, y=71, w=136, h=133` | 12710 | `icons/region-009.png` |
| `region-010` | `cluster-004` (3 boxes) | `x=1148, y=92, w=55, h=48` | 1387 | `icons/region-010.png` |
| `region-011` | `cluster-010` (1 boxes) | `x=1492, y=112, w=136, h=208` | 19285 | `icons/region-011.png` |
| `region-012` | `cluster-011` (1 boxes) | `x=1836, y=156, w=80, h=88` | 5882 | `icons/region-012.png` |
| `region-013` | `cluster-002` (2 boxes) | `x=972, y=160, w=90, h=92` | 6413 | `icons/region-013.png` |
| `region-014` | `cluster-004` (3 boxes) | `x=1300, y=172, w=32, h=32` | 892 | `icons/region-014.png` |
| `region-015` | `cluster-012` (1 boxes) | `x=252, y=229, w=129, h=127` | 12799 | `icons/region-015.png` |
| `region-016` | `cluster-013` (1 boxes) | `x=92, y=235, w=128, h=127` | 12858 | `icons/region-016.png` |
| `region-017` | `cluster-014` (1 boxes) | `x=806, y=235, w=110, h=121` | 12005 | `icons/region-017.png` |
| `region-018` | `cluster-015` (3 boxes) | `x=541, y=237, w=140, h=110` | 10175 | `icons/region-018.png` |
| `region-019` | `cluster-015` (3 boxes) | `x=431, y=242, w=133, h=103` | 8965 | `icons/region-019.png` |
| `region-020` | `cluster-015` (3 boxes) | `x=660, y=242, w=133, h=105` | 9063 | `icons/region-020.png` |
| `region-021` | `cluster-016` (1 boxes) | `x=1796, y=292, w=48, h=48` | 1364 | `icons/region-021.png` |
| `region-022` | `cluster-017` (1 boxes) | `x=1908, y=292, w=44, h=48` | 1264 | `icons/region-022.png` |
| `region-023` | `cluster-018` (1 boxes) | `x=1052, y=300, w=40, h=48` | 1059 | `icons/region-023.png` |
| `region-024` | `cluster-019` (1 boxes) | `x=946, y=304, w=42, h=42` | 1022 | `icons/region-024.png` |
| `region-025` | `cluster-020` (1 boxes) | `x=1122, y=308, w=234, h=40` | 8689 | `icons/region-025.png` |
| `region-026` | `cluster-021` (2 boxes) | `x=1772, y=428, w=181, h=188` | 10524 | `icons/region-026.png` |
| `region-027` | `cluster-022` (1 boxes) | `x=93, y=432, w=179, h=181` | 21047 | `icons/region-027.png` |
| `region-028` | `cluster-023` (5 boxes) | `x=1555, y=435, w=57, h=49` | 1609 | `icons/region-028.png` |
| `region-029` | `cluster-024` (1 boxes) | `x=716, y=436, w=200, h=176` | 20074 | `icons/region-029.png` |
| `region-030` | `cluster-025` (1 boxes) | `x=949, y=436, w=175, h=176` | 16895 | `icons/region-030.png` |
| `region-031` | `cluster-023` (5 boxes) | `x=1686, y=436, w=54, h=48` | 1620 | `icons/region-031.png` |
| `region-032` | `cluster-026` (1 boxes) | `x=1156, y=440, w=174, h=171` | 19928 | `icons/region-032.png` |
| `region-033` | `cluster-027` (1 boxes) | `x=1357, y=444, w=167, h=168` | 22052 | `icons/region-033.png` |
| `region-034` | `cluster-028` (1 boxes) | `x=300, y=445, w=191, h=161` | 11879 | `icons/region-034.png` |
| `region-035` | `cluster-029` (1 boxes) | `x=524, y=446, w=160, h=158` | 20303 | `icons/region-035.png` |
| `region-036` | `cluster-023` (5 boxes) | `x=1596, y=476, w=103, h=102` | 8500 | `icons/region-036.png` |
| `region-037` | `cluster-021` (2 boxes) | `x=1884, y=548, w=72, h=68` | 2073 | `icons/region-037.png` |
| `region-038` | `cluster-023` (5 boxes) | `x=1556, y=566, w=56, h=53` | 1591 | `icons/region-038.png` |
| `region-039` | `cluster-023` (5 boxes) | `x=1684, y=566, w=54, h=54` | 1646 | `icons/region-039.png` |
| `region-040` | `cluster-030` (1 boxes) | `x=1494, y=690, w=446, h=130` | 37786 | `icons/region-040.png` |
| `region-041` | `cluster-031` (1 boxes) | `x=108, y=692, w=456, h=125` | 48983 | `icons/region-041.png` |
| `region-042` | `cluster-032` (1 boxes) | `x=628, y=692, w=384, h=120` | 31001 | `icons/region-042.png` |
| `region-043` | `cluster-033` (1 boxes) | `x=1074, y=698, w=360, h=111` | 28123 | `icons/region-043.png` |
| `region-044` | `cluster-034` (1 boxes) | `x=1503, y=877, w=136, h=143` | 8472 | `icons/region-044.png` |
| `region-045` | `cluster-035` (1 boxes) | `x=76, y=892, w=159, h=105` | 13998 | `icons/region-045.png` |
| `region-046` | `cluster-036` (1 boxes) | `x=1364, y=892, w=101, h=104` | 9480 | `icons/region-046.png` |
| `region-047` | `cluster-037` (1 boxes) | `x=268, y=893, w=103, h=103` | 9120 | `icons/region-047.png` |
| `region-048` | `cluster-038` (1 boxes) | `x=1676, y=894, w=109, h=109` | 7769 | `icons/region-048.png` |
| `region-049` | `cluster-039` (1 boxes) | `x=404, y=899, w=208, h=97` | 18556 | `icons/region-049.png` |
| `region-050` | `cluster-040` (1 boxes) | `x=1820, y=900, w=151, h=88` | 9901 | `icons/region-050.png` |
| `region-051` | `cluster-041` (1 boxes) | `x=650, y=908, w=165, h=78` | 11723 | `icons/region-051.png` |
| `region-052` | `cluster-042` (1 boxes) | `x=1091, y=908, w=241, h=80` | 17994 | `icons/region-052.png` |
| `region-053` | `cluster-043` (1 boxes) | `x=852, y=916, w=200, h=63` | 10734 | `icons/region-053.png` |
| `region-054` | `cluster-044` (1 boxes) | `x=367, y=1036, w=205, h=261` | 22162 | `icons/region-054.png` |
| `region-055` | `cluster-045` (1 boxes) | `x=84, y=1053, w=240, h=231` | 23124 | `icons/region-055.png` |
| `region-056` | `cluster-046` (1 boxes) | `x=1359, y=1062, w=164, h=214` | 12414 | `icons/region-056.png` |
| `region-057` | `cluster-047` (1 boxes) | `x=620, y=1068, w=200, h=200` | 18606 | `icons/region-057.png` |
| `region-058` | `cluster-048` (1 boxes) | `x=1114, y=1068, w=194, h=200` | 24716 | `icons/region-058.png` |
| `region-059` | `cluster-049` (1 boxes) | `x=869, y=1070, w=198, h=197` | 25896 | `icons/region-059.png` |
| `region-060` | `cluster-050` (1 boxes) | `x=1572, y=1083, w=168, h=169` | 14425 | `icons/region-060.png` |
| `region-061` | `cluster-051` (1 boxes) | `x=1788, y=1084, w=167, h=168` | 22096 | `icons/region-061.png` |

### vertical (62 candidate boxes, 59 spatial clusters)

| ID | Cluster | Bbox | Mask area | Crop |
| --- | --- | --- | ---: | --- |
| `region-001` | `cluster-001` (1 boxes) | `x=15, y=13, w=487, h=588` | 221604 | `vertical/region-001.png` |
| `region-002` | `cluster-002` (1 boxes) | `x=516, y=13, w=487, h=588` | 219313 | `vertical/region-002.png` |
| `region-003` | `cluster-003` (1 boxes) | `x=308, y=637, w=103, h=104` | 5923 | `vertical/region-003.png` |
| `region-004` | `cluster-004` (1 boxes) | `x=440, y=641, w=89, h=98` | 5346 | `vertical/region-004.png` |
| `region-005` | `cluster-005` (1 boxes) | `x=706, y=652, w=56, h=67` | 1755 | `vertical/region-005.png` |
| `region-006` | `cluster-006` (1 boxes) | `x=40, y=653, w=250, h=28` | 4977 | `vertical/region-006.png` |
| `region-007` | `cluster-007` (1 boxes) | `x=789, y=655, w=53, h=59` | 1343 | `vertical/region-007.png` |
| `region-008` | `cluster-008` (1 boxes) | `x=562, y=657, w=43, h=56` | 1423 | `vertical/region-008.png` |
| `region-009` | `cluster-009` (1 boxes) | `x=628, y=657, w=58, h=55` | 1801 | `vertical/region-009.png` |
| `region-010` | `cluster-010` (1 boxes) | `x=875, y=658, w=128, h=80` | 5167 | `vertical/region-010.png` |
| `region-011` | `cluster-011` (1 boxes) | `x=43, y=710, w=243, h=20` | 4026 | `vertical/region-011.png` |
| `region-012` | `cluster-012` (1 boxes) | `x=561, y=731, w=45, h=57` | 1517 | `vertical/region-012.png` |
| `region-013` | `cluster-013` (1 boxes) | `x=706, y=736, w=55, h=47` | 1981 | `vertical/region-013.png` |
| `region-014` | `cluster-014` (1 boxes) | `x=791, y=739, w=52, h=40` | 1280 | `vertical/region-014.png` |
| `region-015` | `cluster-015` (1 boxes) | `x=634, y=741, w=35, h=38` | 778 | `vertical/region-015.png` |
| `region-016` | `cluster-016` (1 boxes) | `x=875, y=744, w=128, h=108` | 11928 | `vertical/region-016.png` |
| `region-017` | `cluster-017` (1 boxes) | `x=314, y=757, w=90, h=89` | 3763 | `vertical/region-017.png` |
| `region-018` | `cluster-018` (1 boxes) | `x=40, y=760, w=246, h=29` | 5344 | `vertical/region-018.png` |
| `region-019` | `cluster-019` (1 boxes) | `x=441, y=762, w=88, h=79` | 3307 | `vertical/region-019.png` |
| `region-020` | `cluster-020` (1 boxes) | `x=559, y=812, w=48, h=66` | 1857 | `vertical/region-020.png` |
| `region-021` | `cluster-021` (1 boxes) | `x=792, y=812, w=51, h=65` | 1806 | `vertical/region-021.png` |
| `region-022` | `cluster-022` (1 boxes) | `x=46, y=813, w=235, h=28` | 4507 | `vertical/region-022.png` |
| `region-023` | `cluster-023` (1 boxes) | `x=634, y=814, w=45, h=39` | 792 | `vertical/region-023.png` |
| `region-024` | `cluster-024` (1 boxes) | `x=703, y=820, w=62, h=49` | 2053 | `vertical/region-024.png` |
| `region-025` | `cluster-025` (1 boxes) | `x=45, y=861, w=236, h=38` | 5298 | `vertical/region-025.png` |
| `region-026` | `cluster-026` (1 boxes) | `x=315, y=864, w=89, h=91` | 4435 | `vertical/region-026.png` |
| `region-027` | `cluster-027` (1 boxes) | `x=438, y=864, w=94, h=92` | 3836 | `vertical/region-027.png` |
| `region-028` | `cluster-028` (1 boxes) | `x=875, y=867, w=122, h=49` | 4971 | `vertical/region-028.png` |
| `region-029` | `cluster-029` (1 boxes) | `x=706, y=889, w=56, h=66` | 1881 | `vertical/region-029.png` |
| `region-030` | `cluster-030` (1 boxes) | `x=560, y=893, w=46, h=59` | 1379 | `vertical/region-030.png` |
| `region-031` | `cluster-031` (1 boxes) | `x=793, y=895, w=49, h=53` | 1425 | `vertical/region-031.png` |
| `region-032` | `cluster-032` (1 boxes) | `x=637, y=897, w=48, h=50` | 1689 | `vertical/region-032.png` |
| `region-033` | `cluster-033` (1 boxes) | `x=46, y=919, w=235, h=28` | 5198 | `vertical/region-033.png` |
| `region-034` | `cluster-034` (1 boxes) | `x=873, y=938, w=127, h=44` | 4495 | `vertical/region-034.png` |
| `region-035` | `cluster-035` (1 boxes) | `x=705, y=960, w=58, h=60` | 2114 | `vertical/region-035.png` |
| `region-036` | `cluster-036` (1 boxes) | `x=560, y=965, w=46, h=50` | 1450 | `vertical/region-036.png` |
| `region-037` | `cluster-037` (1 boxes) | `x=634, y=965, w=45, h=49` | 1014 | `vertical/region-037.png` |
| `region-038` | `cluster-038` (1 boxes) | `x=39, y=968, w=246, h=53` | 7138 | `vertical/region-038.png` |
| `region-039` | `cluster-039` (1 boxes) | `x=795, y=969, w=43, h=42` | 1079 | `vertical/region-039.png` |
| `region-040` | `cluster-040` (1 boxes) | `x=311, y=976, w=96, h=87` | 3715 | `vertical/region-040.png` |
| `region-041` | `cluster-041` (1 boxes) | `x=441, y=976, w=88, h=88` | 3400 | `vertical/region-041.png` |
| `region-042` | `cluster-042` (1 boxes) | `x=874, y=998, w=132, h=61` | 6660 | `vertical/region-042.png` |
| `region-043` | `cluster-043` (2 boxes) | `x=549, y=1027, w=304, h=82` | 12639 | `vertical/region-043.png` |
| `region-044` | `cluster-044` (2 boxes) | `x=38, y=1034, w=255, h=57` | 9151 | `vertical/region-044.png` |
| `region-045` | `cluster-043` (2 boxes) | `x=549, y=1072, w=136, h=41` | 4512 | `vertical/region-045.png` |
| `region-046` | `cluster-045` (1 boxes) | `x=884, y=1074, w=111, h=45` | 4961 | `vertical/region-046.png` |
| `region-047` | `cluster-046` (1 boxes) | `x=440, y=1084, w=90, h=85` | 3400 | `vertical/region-047.png` |
| `region-048` | `cluster-044` (2 boxes) | `x=15, y=1088, w=386, h=93` | 17383 | `vertical/region-048.png` |
| `region-049` | `cluster-047` (1 boxes) | `x=541, y=1125, w=148, h=45` | 5416 | `vertical/region-049.png` |
| `region-050` | `cluster-048` (1 boxes) | `x=706, y=1127, w=146, h=36` | 3266 | `vertical/region-050.png` |
| `region-051` | `cluster-049` (1 boxes) | `x=884, y=1146, w=113, h=39` | 3833 | `vertical/region-051.png` |
| `region-052` | `cluster-050` (1 boxes) | `x=12, y=1188, w=185, h=101` | 7290 | `vertical/region-052.png` |
| `region-053` | `cluster-051` (2 boxes) | `x=410, y=1192, w=376, h=145` | 16999 | `vertical/region-053.png` |
| `region-054` | `cluster-052` (1 boxes) | `x=204, y=1202, w=179, h=33` | 4999 | `vertical/region-054.png` |
| `region-055` | `cluster-053` (1 boxes) | `x=791, y=1234, w=205, h=40` | 3801 | `vertical/region-055.png` |
| `region-056` | `cluster-054` (1 boxes) | `x=210, y=1246, w=126, h=48` | 3292 | `vertical/region-056.png` |
| `region-057` | `cluster-051` (2 boxes) | `x=630, y=1259, w=122, h=140` | 10450 | `vertical/region-057.png` |
| `region-058` | `cluster-055` (1 boxes) | `x=12, y=1294, w=186, h=45` | 4685 | `vertical/region-058.png` |
| `region-059` | `cluster-056` (1 boxes) | `x=788, y=1296, w=172, h=39` | 5184 | `vertical/region-059.png` |
| `region-060` | `cluster-057` (1 boxes) | `x=204, y=1327, w=177, h=29` | 4865 | `vertical/region-060.png` |
| `region-061` | `cluster-058` (1 boxes) | `x=435, y=1354, w=171, h=67` | 4571 | `vertical/region-061.png` |
| `region-062` | `cluster-059` (1 boxes) | `x=24, y=1358, w=145, h=51` | 3526 | `vertical/region-062.png` |

### wide (20 candidate boxes, 20 spatial clusters)

| ID | Cluster | Bbox | Mask area | Crop |
| --- | --- | --- | ---: | --- |
| `region-001` | `cluster-001` (1 boxes) | `x=1710, y=61, w=245, h=166` | 35837 | `wide/region-001.png` |
| `region-002` | `cluster-002` (1 boxes) | `x=1997, y=113, w=262, h=82` | 11603 | `wide/region-002.png` |
| `region-003` | `cluster-003` (1 boxes) | `x=1973, y=205, w=286, h=140` | 17892 | `wide/region-003.png` |
| `region-004` | `cluster-004` (1 boxes) | `x=1725, y=247, w=214, h=172` | 32014 | `wide/region-004.png` |
| `region-005` | `cluster-005` (1 boxes) | `x=1375, y=253, w=325, h=166` | 49145 | `wide/region-005.png` |
| `region-006` | `cluster-006` (1 boxes) | `x=2301, y=337, w=470, h=290` | 91908 | `wide/region-006.png` |
| `region-007` | `cluster-007` (1 boxes) | `x=1965, y=349, w=313, h=102` | 12146 | `wide/region-007.png` |
| `region-008` | `cluster-008` (1 boxes) | `x=1373, y=431, w=326, h=194` | 48849 | `wide/region-008.png` |
| `region-009` | `cluster-009` (1 boxes) | `x=1725, y=445, w=214, h=166` | 31042 | `wide/region-009.png` |
| `region-010` | `cluster-010` (1 boxes) | `x=29, y=573, w=295, h=374` | 74102 | `wide/region-010.png` |
| `region-011` | `cluster-011` (1 boxes) | `x=2509, y=637, w=262, h=124` | 22275 | `wide/region-011.png` |
| `region-012` | `cluster-012` (1 boxes) | `x=1262, y=972, w=381, h=343` | 111046 | `wide/region-012.png` |
| `region-013` | `cluster-013` (1 boxes) | `x=1981, y=973, w=320, h=22` | 4692 | `wide/region-013.png` |
| `region-014` | `cluster-014` (1 boxes) | `x=1990, y=1021, w=317, h=23` | 5173 | `wide/region-014.png` |
| `region-015` | `cluster-015` (1 boxes) | `x=1989, y=1069, w=305, h=37` | 5692 | `wide/region-015.png` |
| `region-016` | `cluster-016` (1 boxes) | `x=2349, y=1077, w=118, h=246` | 18843 | `wide/region-016.png` |
| `region-017` | `cluster-017` (1 boxes) | `x=2637, y=1085, w=134, h=238` | 17618 | `wide/region-017.png` |
| `region-018` | `cluster-018` (1 boxes) | `x=1981, y=1117, w=321, h=38` | 6144 | `wide/region-018.png` |
| `region-019` | `cluster-019` (1 boxes) | `x=1988, y=1165, w=335, h=38` | 7796 | `wide/region-019.png` |
| `region-020` | `cluster-020` (1 boxes) | `x=1981, y=1227, w=342, h=88` | 19446 | `wide/region-020.png` |

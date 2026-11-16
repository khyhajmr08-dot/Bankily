# Reference Design Specification (Pixel-Sampled from 720×1600 / 360×800dp Screenshots)

## 1. Reference Viewport
- **Original Device Resolution**: `720 × 1600 px` (`xhdpi`, `2.0x` density) -> `360 × 800 dp`
- **System Bars**: Status Bar ~`32dp` (`64px`), Bottom Gesture Area ~`13.5dp` (`27px`)
- **App Content Canvas**: `360 × 754 dp`

## 2. Pixel-Sampled Color Palette
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `PrimaryTurquoise` | `#00BCD5` | Top bars, tab bar, QR icon, dotted box border & `+`, modal confirm buttons |
| `DarkTurquoise` | `#008CA0` | `إرسال الأموال` action button on Home |
| `BrandYellow` | `#FEC107` | `طلب المال` button, `إرسال` & `أتمم` bottom bars, active phone icon, contact book icon |
| `CanvasWhite` | `#FAFAFA` | Screen background canvas |
| `SurfaceWhite` | `#FFFFFF` | Modals and pure white surfaces |
| `BandGray` | `#EFEFEF` | `التحويل السريع` and `اللوحة` section bands on Home |
| `InfoCardGray` | `#F2F2F2` | Transfer details summary card on Confirmation screen |
| `SlateCircleGray` | `#596978` | Circular recipient icon background on Confirmation screen |
| `SuccessGreen` | `#4EB250` | Success checkmark and circle border |
| `PrimaryText` | `#171717` | Primary headings, labels, entered values |
| `SecondaryText` | `#777777` | Input placeholders, close `×`, unselected favorite label |
| `ModalBackdrop` | `rgba(0, 0, 0, 0.61)` | Darkened overlay behind PIN and Success modals |

## 3. Screen-by-Screen Measured Geometry (`360dp` width baseline)
- **Screen 01 (`تحويل الأموال`)**:
  - Top turquoise header total height: `207dp` (`85dp` title area + `89dp` sharp `0dp`-radius button row + `31dp` bottom padding; `6.5dp` outer horizontal padding, `12dp` gap between buttons)
  - `التحويل السريع` band: `70dp` height (`#EFEFEF`)
  - `رمز QR` section: `140dp` height (`#FAFAFA`), `34dp` crisp QR icon
  - `اللوحة` band: `70dp` height (`#EFEFEF`)
  - Bottom panel: `#FAFAFA`, `100 × 100 dp` dotted `#00BCD5` square with centered `+`
- **Screen 02 (`إرسال الأموال`)**:
  - Turquoise header + 4-tab bar: `120dp` total height (`52dp` top bar + `68dp` tabs; seamless `#00BCD5` inactive tabs, `3dp` `#FFFFFF` indicator only under selected tab)
  - Scrollable form region (`flex-1 overflow-y-auto`, `#FAFAFA`)
  - Fixed bottom `إرسال` button (`53dp` height, `#FEC107`, full-width, pinned outside scrollable container)
- **Screen 03 (`تأكيد تحويل الأموال`)**:
  - Turquoise header: `53dp` height
  - Scrollable review content (`flex-1 overflow-y-auto`, `#FAFAFA`), `11.5dp` horizontal margin on `#F2F2F2` card (`4dp` radius), `1.5dp` `#FFFFFF` horizontal divider
  - Fee rules: `<= 100` MRU -> `0 / 0 / 0`; `> 100` MRU -> `serviceFee = round2(amount * 2 / 116)`, `commission = 0`, `tax = round2(serviceFee * 0.20)` (`2 000` MRU -> `34.48 / 0 / 6.9`)
  - Fixed bottom `أتمم` button (`53dp` height, `#FEC107`, pinned outside scrollable container)
- **Screen 04 (`الرجاء إدخال الرمز السري`)**:
  - Centered white modal: `176.5dp` (`177dp`) width, `192dp` total height (`138dp` body + `54dp` `#00BCD5` bottom button `ارسل الطلب`)
  - 4 digit underlines: `23.5dp` (`24dp`) width each, `14.5dp` (`14dp`) gap
- **Screen 05 (`النقل ناجح!`)**:
  - Centered white modal: `306dp` width (`85%` of `360dp`), `19`-digit transaction ID (`01` + `yyMMddHHmmss` + 1-digit seq + 4 random digits), single-line metadata, `50dp` `#00BCD5` bottom button (`تم`)
- **Screen 06 (`طلب المال` — measured from `Bankily_db2dec9a.jpg`)**:
  - Turquoise header + 3-tab bar (`رقم الهاتف`, `اسم المستخدم`, `فيسبوك`): `120dp` total height (`52dp` + `68dp`)
  - `أدخل تفاصيل الدافع` section title + phone/username/facebook + amount + optional note underlines
  - Inset yellow `طلب` button: `325dp` width (`17.5dp` left/right margin, `17dp` bottom margin), `53dp` height
- **Screen 07 (`اللوحة` — measured from `Bankily_54e62468.jpg`)**:
  - Turquoise header: `53dp` height
  - `المبلغ`, `ملاحظة`, `أفراد` (`#00BCD5` initial avatar `أ` + `أنت` + `32014902` + `54dp` `0.00` underline), `إضافة أفراد` (bottom-left `+` badge on slate bust)
  - Fixed full-width `التالي` yellow button (`53dp` height)


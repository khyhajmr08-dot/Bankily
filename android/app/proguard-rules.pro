# ProGuard / R8 keep rules for Bankily (MauriTransfer)
-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.annotation.Keep <methods>;
}

package com.mauritop.transfer.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp

object TransferDimens {
    val HeaderHeight = 52.dp
    val BottomButtonHeight = 53.dp
    val DialogButtonHeight = 53.dp
    val SuccessDialogButtonHeight = 50.dp
    val HorizontalPadding = 16.dp
}

@Composable
fun TransferAppTheme(
    content: @Composable () -> Unit
) {
    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        content()
    }
}

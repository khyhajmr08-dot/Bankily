package com.mauritop.transfer.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mauritop.transfer.model.DirectoryData
import com.mauritop.transfer.model.RecipientMethod
import com.mauritop.transfer.ui.components.BankBuildingIcon
import com.mauritop.transfer.ui.components.ContactBookVectorIcon
import com.mauritop.transfer.ui.components.FacebookCircleIcon
import com.mauritop.transfer.ui.components.PhoneOutlineIcon
import com.mauritop.transfer.ui.components.TurquoiseTopBar
import com.mauritop.transfer.ui.components.UsernameBustIcon
import com.mauritop.transfer.ui.theme.BackgroundWhite
import com.mauritop.transfer.ui.theme.BrandYellow
import com.mauritop.transfer.ui.theme.ErrorRed
import com.mauritop.transfer.ui.theme.InputUnderline
import com.mauritop.transfer.ui.theme.MainTurquoise
import com.mauritop.transfer.ui.theme.PrimaryText
import com.mauritop.transfer.ui.theme.SecondaryText
import com.mauritop.transfer.ui.theme.TransferDimens
import com.mauritop.transfer.viewmodel.TransferUiState

@Composable
fun SendMoneyScreen(
    uiState: TransferUiState,
    onSelectMethod: (RecipientMethod) -> Unit,
    onPhoneChange: (String) -> Unit,
    onUsernameChange: (String) -> Unit,
    onBankNameChange: (String) -> Unit,
    onBankAccountChange: (String) -> Unit,
    onFacebookChange: (String) -> Unit,
    onAmountChange: (String) -> Unit,
    onNoteChange: (String) -> Unit,
    onBackClick: () -> Unit,
    onSubmitClick: () -> Unit
) {
    var showContactsDialog by remember { mutableStateOf(false) }
    var showBankDropdown by remember { mutableStateOf(false) }
    val draft = uiState.draft

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundWhite)
    ) {
        // Turquoise Top Header + 4 Horizontal Tabs
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(MainTurquoise)
        ) {
            TurquoiseTopBar(title = "إرسال الأموال", onBackClick = onBackClick)

            Row(modifier = Modifier.fillMaxWidth()) {
                RecipientMethod.entries.forEach { method ->
                    val isSelected = draft.method == method
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .height(68.dp)
                            .clickable { onSelectMethod(method) },
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Spacer(modifier = Modifier.height(6.dp))
                        Box(
                            modifier = Modifier.size(30.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            val iconTint = if (isSelected) BrandYellow else Color.White
                            when (method) {
                                RecipientMethod.PHONE -> PhoneOutlineIcon(
                                    color = iconTint,
                                    modifier = Modifier.size(28.dp)
                                )
                                RecipientMethod.USERNAME -> UsernameBustIcon(
                                    color = iconTint,
                                    modifier = Modifier.size(30.dp)
                                )
                                RecipientMethod.BANK -> BankBuildingIcon(
                                    color = iconTint,
                                    modifier = Modifier.size(30.dp)
                                )
                                RecipientMethod.FACEBOOK -> FacebookCircleIcon(
                                    circleColor = iconTint,
                                    letterColor = MainTurquoise,
                                    modifier = Modifier.size(28.dp)
                                )
                            }
                        }
                        Text(
                            text = method.labelAr,
                            color = Color.White,
                            fontSize = 11.5.sp,
                            fontWeight = if (isSelected) FontWeight.Medium else FontWeight.Normal,
                            maxLines = 1
                        )
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(3.dp)
                                .background(if (isSelected) Color.White else Color.Transparent)
                        )
                    }
                }
            }
        }

        // Form Fields
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = TransferDimens.HorizontalPadding, vertical = 24.dp),
            verticalArrangement = Arrangement.spacedBy(26.dp)
        ) {
            when (draft.method) {
                RecipientMethod.PHONE -> {
                    UnderlineInputSection(
                        label = "رقم الهاتف",
                        value = draft.phone,
                        onValueChange = onPhoneChange,
                        placeholder = "أدخل رقم الهاتف",
                        keyboardType = KeyboardType.Number,
                        errorText = uiState.recipientError,
                        trailingContent = {
                            ContactBookVectorIcon(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clickable { showContactsDialog = true }
                            )
                        }
                    )
                }

                RecipientMethod.USERNAME -> {
                    UnderlineInputSection(
                        label = "اسم المستخدم",
                        value = draft.username,
                        onValueChange = onUsernameChange,
                        placeholder = "أدخل اسم المستخدم",
                        keyboardType = KeyboardType.Text,
                        errorText = uiState.recipientError,
                        trailingContent = {
                            ContactBookVectorIcon(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clickable { showContactsDialog = true }
                            )
                        }
                    )
                }

                RecipientMethod.BANK -> {
                    Column {
                        Text(text = "اسم البنك", color = PrimaryText, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { showBankDropdown = true }
                                .padding(bottom = 8.dp)
                        ) {
                            Text(text = draft.bankName, color = PrimaryText, fontSize = 15.sp)
                            DropdownMenu(
                                expanded = showBankDropdown,
                                onDismissRequest = { showBankDropdown = false }
                            ) {
                                DirectoryData.banks.forEach { bank ->
                                    DropdownMenuItem(
                                        text = { Text(bank) },
                                        onClick = {
                                            onBankNameChange(bank)
                                            showBankDropdown = false
                                        }
                                    )
                                }
                            }
                        }
                        HorizontalDivider(thickness = 1.dp, color = InputUnderline)
                    }

                    UnderlineInputSection(
                        label = "رقم الحساب البنكي",
                        value = draft.bankAccount,
                        onValueChange = onBankAccountChange,
                        placeholder = "أدخل رقم الحساب البنكي",
                        keyboardType = KeyboardType.Ascii,
                        errorText = uiState.recipientError,
                        trailingContent = {
                            ContactBookVectorIcon(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clickable { showContactsDialog = true }
                            )
                        }
                    )
                }

                RecipientMethod.FACEBOOK -> {
                    UnderlineInputSection(
                        label = "حساب فيسبوك",
                        value = draft.facebookAccount,
                        onValueChange = onFacebookChange,
                        placeholder = "أدخل اسم حساب فيسبوك",
                        keyboardType = KeyboardType.Text,
                        errorText = uiState.recipientError,
                        trailingContent = {
                            ContactBookVectorIcon(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clickable { showContactsDialog = true }
                            )
                        }
                    )
                }
            }

            UnderlineInputSection(
                label = "المبلغ",
                value = draft.amount,
                onValueChange = onAmountChange,
                placeholder = "أدخل المبلغ",
                keyboardType = KeyboardType.Decimal,
                errorText = uiState.amountError
            )

            UnderlineInputSection(
                label = "ملاحظة (اختياري)",
                value = draft.note,
                onValueChange = onNoteChange,
                placeholder = "أدخل ملاحظة",
                keyboardType = KeyboardType.Text,
                errorText = null
            )
        }

        // Full-Width Bottom Yellow Button
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(TransferDimens.BottomButtonHeight)
                .background(BrandYellow)
                .clickable(onClick = onSubmitClick),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "إرسال",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }

    if (showContactsDialog) {
        AlertDialog(
            onDismissRequest = { showContactsDialog = false },
            title = { Text("جهات الاتصال") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    DirectoryData.contacts.forEach { contact ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    when (draft.method) {
                                        RecipientMethod.PHONE -> onPhoneChange(contact.phone)
                                        RecipientMethod.USERNAME -> onUsernameChange(contact.username)
                                        RecipientMethod.BANK -> onBankAccountChange(contact.bankAccount)
                                        RecipientMethod.FACEBOOK -> onFacebookChange(contact.facebook)
                                    }
                                    showContactsDialog = false
                                }
                                .padding(vertical = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(contact.name, fontWeight = FontWeight.Medium)
                            Text(contact.phone, color = SecondaryText)
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showContactsDialog = false }) {
                    Text("إغلاق")
                }
            }
        )
    }
}

@Composable
private fun UnderlineInputSection(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    keyboardType: KeyboardType,
    errorText: String?,
    trailingContent: @Composable (() -> Unit)? = null
) {
    var isFocused by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxWidth()) {
        Text(text = label, color = PrimaryText, fontSize = 15.sp)
        Spacer(modifier = Modifier.height(8.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(modifier = Modifier.weight(1f)) {
                if (value.isEmpty()) {
                    Text(
                        text = placeholder,
                        color = SecondaryText,
                        fontSize = 17.sp,
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Start
                    )
                }
                BasicTextField(
                    value = value,
                    onValueChange = onValueChange,
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
                    textStyle = TextStyle(
                        color = PrimaryText,
                        fontSize = 17.sp,
                        textAlign = TextAlign.Start
                    ),
                    cursorBrush = SolidColor(MainTurquoise),
                    modifier = Modifier
                        .fillMaxWidth()
                        .onFocusChanged { isFocused = it.isFocused }
                )
            }
            if (trailingContent != null) {
                trailingContent()
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        HorizontalDivider(
            thickness = if (isFocused || errorText != null) 2.dp else 1.dp,
            color = when {
                errorText != null -> ErrorRed
                isFocused -> Color(0xFF111111)
                else -> InputUnderline
            }
        )
        if (errorText != null) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = errorText, color = ErrorRed, fontSize = 12.sp)
        }
    }
}

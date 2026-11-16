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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mauritop.transfer.model.DirectoryData
import com.mauritop.transfer.model.SplitGroup
import com.mauritop.transfer.ui.components.AddMemberVectorIcon
import com.mauritop.transfer.ui.components.TurquoiseTopBar
import com.mauritop.transfer.ui.theme.BackgroundWhite
import com.mauritop.transfer.ui.theme.BrandYellow
import com.mauritop.transfer.ui.theme.DeepTurquoise
import com.mauritop.transfer.ui.theme.ErrorRed
import com.mauritop.transfer.ui.theme.InputUnderline
import com.mauritop.transfer.ui.theme.MainTurquoise
import com.mauritop.transfer.ui.theme.PrimaryText
import com.mauritop.transfer.ui.theme.SecondaryText
import com.mauritop.transfer.ui.theme.TransferDimens
import java.util.Locale

@Composable
fun BoardScreen(
    splitGroups: List<SplitGroup>,
    onBackClick: () -> Unit,
    onCreateSplitGroup: (name: String, total: Double, members: List<Triple<String, String, Double>>) -> SplitGroup,
    onPrefillSend: (phone: String, amount: String, note: String) -> Unit
) {
    var totalAmount by remember { mutableStateOf("") }
    var note by remember { mutableStateOf("") }
    val participants = remember {
        mutableStateListOf(DirectoryData.OWNER_NAME to DirectoryData.OWNER_PHONE)
    }
    var errorMsg by remember { mutableStateOf<String?>(null) }
    var showAddMemberDialog by remember { mutableStateOf(false) }
    var savedGroup by remember { mutableStateOf<SplitGroup?>(null) }

    val numericTotal = totalAmount.replace(',', '.').toDoubleOrNull()?.takeIf { it > 0 } ?: 0.0
    val equalShare = if (numericTotal > 0.0 && participants.isNotEmpty()) {
        numericTotal / participants.size
    } else 0.0
    val shareDisplay = String.format(Locale.US, "%.2f", equalShare)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundWhite)
    ) {
        TurquoiseTopBar(title = "اللوحة", onBackClick = onBackClick)

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = TransferDimens.HorizontalPadding, vertical = 20.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            // Amount Field
            Column {
                Text(text = "المبلغ", color = PrimaryText, fontSize = 15.sp)
                Spacer(modifier = Modifier.height(8.dp))
                Box(modifier = Modifier.fillMaxWidth()) {
                    if (totalAmount.isEmpty()) {
                        Text(
                            text = "أدخل المبلغ",
                            color = SecondaryText,
                            fontSize = 17.sp,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    BasicTextField(
                        value = totalAmount,
                        onValueChange = {
                            totalAmount = it.replace(',', '.')
                            errorMsg = null
                        },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        textStyle = TextStyle(color = PrimaryText, fontSize = 17.sp),
                        cursorBrush = SolidColor(MainTurquoise),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                HorizontalDivider(thickness = 1.dp, color = InputUnderline)
            }

            // Note Field
            Column {
                Text(text = "ملاحظة", color = PrimaryText, fontSize = 15.sp)
                Spacer(modifier = Modifier.height(8.dp))
                Box(modifier = Modifier.fillMaxWidth()) {
                    if (note.isEmpty()) {
                        Text(
                            text = "أدخل ملاحظة",
                            color = SecondaryText,
                            fontSize = 17.sp,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    BasicTextField(
                        value = note,
                        onValueChange = { note = it },
                        singleLine = true,
                        textStyle = TextStyle(color = PrimaryText, fontSize = 17.sp),
                        cursorBrush = SolidColor(MainTurquoise),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                HorizontalDivider(thickness = 1.dp, color = InputUnderline)
            }

            // Members Heading
            Text(
                text = "أفراد",
                color = PrimaryText,
                fontSize = 15.5.sp,
                fontWeight = FontWeight.Normal
            )

            // Participant Rows
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                participants.forEachIndexed { index, (name, phone) ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(CircleShape)
                                    .background(MainTurquoise),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = name.take(1),
                                    color = Color.White,
                                    fontSize = 18.sp
                                )
                            }
                            Column {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Text(text = name, color = PrimaryText, fontSize = 15.sp)
                                    if (index > 0) {
                                        Text(
                                            text = "حذف",
                                            color = ErrorRed,
                                            fontSize = 11.5.sp,
                                            modifier = Modifier.clickable {
                                                participants.removeAt(index)
                                            }
                                        )
                                    }
                                }
                                Text(text = phone, color = PrimaryText, fontSize = 14.sp)
                            }
                        }

                        Column(
                            modifier = Modifier.width(54.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = shareDisplay,
                                color = PrimaryText,
                                fontSize = 15.sp,
                                textAlign = TextAlign.Center
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            HorizontalDivider(thickness = 1.dp, color = PrimaryText)
                        }
                    }
                }

                // Add Members Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { showAddMemberDialog = true }
                        .padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    AddMemberVectorIcon(modifier = Modifier.size(44.dp))
                    Text(text = "إضافة أفراد", color = PrimaryText, fontSize = 15.5.sp)
                }
            }

            if (errorMsg != null) {
                Text(text = errorMsg!!, color = ErrorRed, fontSize = 12.5.sp)
            }

            if (splitGroups.isNotEmpty()) {
                HorizontalDivider(color = Color(0xFFE5E5E5))
                Text(text = "المجموعات المحفوظة (${splitGroups.size})", color = SecondaryText, fontSize = 13.sp)
                splitGroups.forEach { grp ->
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(grp.name, fontWeight = FontWeight.Medium)
                            Text("MRU ${grp.totalAmount}", color = DeepTurquoise, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Fixed Bottom Yellow Action Bar (التالي)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(TransferDimens.BottomButtonHeight)
                .background(BrandYellow)
                .clickable {
                    if (numericTotal <= 0.0) {
                        errorMsg = "الرجاء إدخال المبلغ"
                    } else if (participants.size < 2) {
                        errorMsg = "أضف فرداً واحداً على الأقل لتقسيم المبلغ"
                    } else {
                        val groupName = note.trim().ifEmpty { "مجموعة (${participants.size} أفراد)" }
                        val triples = participants.map { (n, p) -> Triple(n, p, equalShare) }
                        savedGroup = onCreateSplitGroup(groupName, numericTotal, triples)
                    }
                },
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "التالي",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Normal
            )
        }
    }

    if (showAddMemberDialog) {
        AlertDialog(
            onDismissRequest = { showAddMemberDialog = false },
            title = { Text("إضافة أفراد") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    DirectoryData.contacts.forEach { c ->
                        val added = participants.any { it.second == c.phone }
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable(enabled = !added) {
                                    participants.add(c.name to c.phone)
                                    errorMsg = null
                                    showAddMemberDialog = false
                                }
                                .padding(vertical = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("${c.name} (${c.phone})")
                            Text(if (added) "مضاف" else "إضافة", color = DeepTurquoise)
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showAddMemberDialog = false }) {
                    Text("إغلاق")
                }
            }
        )
    }

    savedGroup?.let { grp ->
        AlertDialog(
            onDismissRequest = {
                savedGroup = null
                onBackClick()
            },
            title = { Text("تفاصيل تقسيم المبلغ") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    grp.members.forEach { m ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(m.name)
                            if (m.phone != DirectoryData.OWNER_PHONE) {
                                TextButton(onClick = {
                                    savedGroup = null
                                    onPrefillSend(m.phone, String.format(Locale.US, "%.2f", m.share), grp.name)
                                }) {
                                    Text("إرسال MRU ${String.format(Locale.US, "%.2f", m.share)}")
                                }
                            } else {
                                Text("MRU ${String.format(Locale.US, "%.2f", m.share)}")
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    savedGroup = null
                    onBackClick()
                }) {
                    Text("تم")
                }
            }
        )
    }
}

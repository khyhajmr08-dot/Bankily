package com.mauritop.transfer.ui.screens

import androidx.compose.foundation.Canvas
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mauritop.transfer.model.DirectoryData
import com.mauritop.transfer.model.TransactionRecord
import com.mauritop.transfer.ui.components.QrVectorIcon
import com.mauritop.transfer.ui.components.TurquoiseTopBar
import com.mauritop.transfer.ui.theme.BackgroundWhite
import com.mauritop.transfer.ui.theme.BrandYellow
import com.mauritop.transfer.ui.theme.DeepTurquoise
import com.mauritop.transfer.ui.theme.MainTurquoise
import com.mauritop.transfer.ui.theme.PrimaryText
import com.mauritop.transfer.ui.theme.SecondaryGray
import com.mauritop.transfer.ui.theme.SecondaryText

@Composable
fun HomeScreen(
    transactions: List<TransactionRecord>,
    onNavigateToSend: () -> Unit,
    onNavigateToRequest: () -> Unit,
    onNavigateToBoard: () -> Unit,
    onPrefillSend: (phone: String, amount: String, note: String) -> Unit,
    onOpenReceipt: (TransactionRecord) -> Unit
) {
    var showQrDialog by remember { mutableStateOf(false) }
    var showHistoryDialog by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundWhite)
    ) {
        // Top Turquoise Header + Action Buttons
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(MainTurquoise)
        ) {
            TurquoiseTopBar(
                title = "تحويل الأموال",
                onBackClick = { showHistoryDialog = true },
                height = 85.dp
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 6.5.dp)
                    .padding(bottom = 31.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Right in RTL: Send Money (Deep Turquoise #008CA0, 0dp sharp corners)
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(89.dp)
                        .background(DeepTurquoise, shape = RoundedCornerShape(0.dp))
                        .clickable(onClick = onNavigateToSend),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        SendMoneyBillCanvas(modifier = Modifier.size(width = 62.dp, height = 30.dp))
                        Text(
                            text = "إرسال الأموال",
                            color = Color.White,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Normal
                        )
                    }
                }

                // Left in RTL: Request Money (Yellow #FEC107, 0dp sharp corners)
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(89.dp)
                        .background(BrandYellow, shape = RoundedCornerShape(0.dp))
                        .clickable(onClick = onNavigateToRequest),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        RequestMoneyBillCanvas(modifier = Modifier.size(width = 62.dp, height = 30.dp))
                        Text(
                            text = "طلب المال",
                            color = Color.White,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Normal
                        )
                    }
                }
            }
        }

        // Quick Transfer Gray Header Band (70.dp)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(70.dp)
                .background(SecondaryGray),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "التحويل السريع",
                color = PrimaryText,
                fontSize = 16.sp,
                fontWeight = FontWeight.Normal
            )
        }

        // QR Code Section (140.dp)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
                .background(BackgroundWhite)
                .clickable { showQrDialog = true },
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                QrVectorIcon(color = MainTurquoise, modifier = Modifier.size(34.dp))
                Text(
                    text = "رمز QR",
                    color = PrimaryText,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Normal
                )
            }
        }

        // Board Gray Header Band (70.dp)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(70.dp)
                .background(SecondaryGray),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "اللوحة",
                color = PrimaryText,
                fontSize = 16.sp,
                fontWeight = FontWeight.Normal
            )
        }

        // Bottom Group Split Section
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .background(BackgroundWhite)
                .padding(horizontal = 24.dp, vertical = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "أنشئ مجموعة جديدة أو حدد مجموعة حالية لتقسيم المبلغ",
                color = PrimaryText,
                fontSize = 13.5.sp,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(28.dp))

            Box(
                modifier = Modifier
                    .size(100.dp)
                    .clickable(onClick = onNavigateToBoard),
                contentAlignment = Alignment.Center
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    drawRect(
                        color = MainTurquoise,
                        style = Stroke(
                            width = 2.5.dp.toPx(),
                            pathEffect = PathEffect.dashPathEffect(floatArrayOf(5f, 7f), 0f)
                        )
                    )
                    val cx = size.width / 2f
                    val cy = size.height / 2f
                    val arm = 16.dp.toPx()
                    drawLine(
                        color = MainTurquoise,
                        start = Offset(cx - arm, cy),
                        end = Offset(cx + arm, cy),
                        strokeWidth = 2.dp.toPx(),
                        cap = StrokeCap.Round
                    )
                    drawLine(
                        color = MainTurquoise,
                        start = Offset(cx, cy - arm),
                        end = Offset(cx, cy + arm),
                        strokeWidth = 2.dp.toPx(),
                        cap = StrokeCap.Round
                    )
                }
            }
        }
    }

    if (showQrDialog) {
        AlertDialog(
            onDismissRequest = { showQrDialog = false },
            title = { Text("التحويل السريع — رمز QR") },
            text = {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QrVectorIcon(color = MainTurquoise, modifier = Modifier.size(84.dp))
                    DirectoryData.contacts.forEach { contact ->
                        TextButton(
                            onClick = {
                                showQrDialog = false
                                onPrefillSend(contact.phone, "50", "تحويل عبر رمز QR")
                            }
                        ) {
                            Text("${contact.name} (${contact.phone})")
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showQrDialog = false }) {
                    Text("إغلاق")
                }
            }
        )
    }

    if (showHistoryDialog) {
        AlertDialog(
            onDismissRequest = { showHistoryDialog = false },
            title = { Text("سجل المعاملات") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    if (transactions.isEmpty()) {
                        Text("لا توجد معاملات محفوظة بعد.", color = SecondaryText, fontSize = 13.sp)
                    } else {
                        transactions.take(6).forEach { tx ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        showHistoryDialog = false
                                        onOpenReceipt(tx)
                                    }
                                    .padding(vertical = 6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column {
                                    Text(tx.recipientDisplay, fontWeight = FontWeight.Medium)
                                    Text(tx.timestamp, color = SecondaryText, fontSize = 11.sp)
                                }
                                Text("MRU ${tx.amount}", color = DeepTurquoise, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showHistoryDialog = false }) {
                    Text("إغلاق")
                }
            }
        )
    }
}

@Composable
private fun SendMoneyBillCanvas(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        drawRoundRect(
            color = Color.White,
            topLeft = Offset(0f, h * 0.1f),
            size = androidx.compose.ui.geometry.Size(w * 0.62f, h * 0.8f),
            cornerRadius = CornerRadius(3.dp.toPx(), 3.dp.toPx())
        )
        drawCircle(
            color = DeepTurquoise,
            radius = h * 0.25f,
            center = Offset(w * 0.31f, h * 0.5f)
        )
        listOf(0.22f, 0.5f, 0.78f).forEach { yFactor ->
            drawLine(
                color = Color.White,
                start = Offset(w * 0.68f, h * yFactor),
                end = Offset(w * 0.96f, h * yFactor),
                strokeWidth = 3.dp.toPx(),
                cap = StrokeCap.Round
            )
        }
    }
}

@Composable
private fun RequestMoneyBillCanvas(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        drawRoundRect(
            color = Color.White,
            topLeft = Offset(0f, h * 0.1f),
            size = androidx.compose.ui.geometry.Size(w * 0.6f, h * 0.8f),
            cornerRadius = CornerRadius(3.dp.toPx(), 3.dp.toPx())
        )
        drawCircle(
            color = BrandYellow,
            radius = h * 0.25f,
            center = Offset(w * 0.3f, h * 0.5f)
        )
        drawLine(
            color = Color.White,
            start = Offset(w * 0.95f, h * 0.5f),
            end = Offset(w * 0.65f, h * 0.5f),
            strokeWidth = 3.dp.toPx(),
            cap = StrokeCap.Round
        )
        drawLine(
            color = Color.White,
            start = Offset(w * 0.78f, h * 0.3f),
            end = Offset(w * 0.65f, h * 0.5f),
            strokeWidth = 3.dp.toPx(),
            cap = StrokeCap.Round
        )
        drawLine(
            color = Color.White,
            start = Offset(w * 0.78f, h * 0.7f),
            end = Offset(w * 0.65f, h * 0.5f),
            strokeWidth = 3.dp.toPx(),
            cap = StrokeCap.Round
        )
    }
}

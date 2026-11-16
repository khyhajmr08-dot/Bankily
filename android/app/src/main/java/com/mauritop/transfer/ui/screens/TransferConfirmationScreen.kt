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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mauritop.transfer.model.RecipientMethod
import com.mauritop.transfer.model.TransferDraft
import com.mauritop.transfer.ui.components.BankBuildingIcon
import com.mauritop.transfer.ui.components.FacebookCircleIcon
import com.mauritop.transfer.ui.components.PhoneOutlineIcon
import com.mauritop.transfer.ui.components.TurquoiseTopBar
import com.mauritop.transfer.ui.components.UsernameBustIcon
import com.mauritop.transfer.ui.theme.BackgroundWhite
import com.mauritop.transfer.ui.theme.BrandYellow
import com.mauritop.transfer.ui.theme.DividerGray
import com.mauritop.transfer.ui.theme.InfoCardGray
import com.mauritop.transfer.ui.theme.PrimaryText
import com.mauritop.transfer.ui.theme.SlateCircleGray
import com.mauritop.transfer.ui.theme.TransferDimens
import com.mauritop.transfer.viewmodel.TransferViewModel

@Composable
fun TransferConfirmationScreen(
    draft: TransferDraft,
    onBackClick: () -> Unit,
    onCompleteClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundWhite)
    ) {
        TurquoiseTopBar(title = "تأكيد تحويل الأموال", onBackClick = onBackClick)

        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = TransferDimens.HorizontalPadding, vertical = 20.dp)
        ) {
            Text(
                text = "مراجعة التفاصيل المدخلة",
                color = PrimaryText,
                fontSize = 16.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Recipient Row
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .clip(CircleShape)
                        .background(SlateCircleGray),
                    contentAlignment = Alignment.Center
                ) {
                    when (draft.method) {
                        RecipientMethod.PHONE -> PhoneOutlineIcon(
                            color = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                        RecipientMethod.USERNAME -> UsernameBustIcon(
                            color = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                        RecipientMethod.BANK -> BankBuildingIcon(
                            color = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                        RecipientMethod.FACEBOOK -> FacebookCircleIcon(
                            circleColor = Color.White,
                            letterColor = SlateCircleGray,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }

                Text(
                    text = draft.recipientDisplay(),
                    color = PrimaryText,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Light Gray Info Card
            val formattedAmount = TransferViewModel.formatMruDisplay(draft.amount)
            val fees = TransferViewModel.calculateFeeBreakdown(draft.amount)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(4.dp))
                    .background(InfoCardGray)
                    .padding(16.dp)
            ) {
                Text(text = "المبلغ", color = PrimaryText, fontSize = 15.sp)
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "MRU $formattedAmount",
                    color = PrimaryText,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(thickness = 1.5.dp, color = Color.White)
                Spacer(modifier = Modifier.height(14.dp))

                Text(text = "تفاصيل تكلفة الخدمة", color = PrimaryText, fontSize = 15.sp)
                Spacer(modifier = Modifier.height(14.dp))

                FeeRow(label = "تكلفة الخدمة", value = "MRU ${fees.serviceFee}")
                Spacer(modifier = Modifier.height(12.dp))
                FeeRow(label = "العمولة", value = "MRU ${fees.commission}")
                Spacer(modifier = Modifier.height(12.dp))
                FeeRow(label = "الضريبة", value = "MRU ${fees.tax}")
            }
        }

        // Bottom Full-Width Yellow Button
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(TransferDimens.BottomButtonHeight)
                .background(BrandYellow)
                .clickable(onClick = onCompleteClick),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "أتمم",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
private fun FeeRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, color = PrimaryText, fontSize = 15.sp, modifier = Modifier.weight(1f))
        Text(text = "-", color = PrimaryText, fontSize = 15.sp)
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = value,
            color = PrimaryText,
            fontSize = 15.sp,
            modifier = Modifier.weight(1f),
            textAlign = androidx.compose.ui.text.style.TextAlign.End
        )
    }
}

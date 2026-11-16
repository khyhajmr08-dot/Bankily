package com.mauritop.transfer.ui.dialogs

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
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
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mauritop.transfer.model.TransactionRecord
import com.mauritop.transfer.ui.theme.BrandYellow
import com.mauritop.transfer.ui.theme.FavoriteGray
import com.mauritop.transfer.ui.theme.MainTurquoise
import com.mauritop.transfer.ui.theme.ModalOverlay
import com.mauritop.transfer.ui.theme.PrimaryText
import com.mauritop.transfer.ui.theme.SecondaryText
import com.mauritop.transfer.ui.theme.SuccessGreen
import com.mauritop.transfer.ui.theme.TransferDimens

@Composable
fun TransferSuccessDialog(
    transaction: TransactionRecord,
    onToggleFavorite: (String) -> Unit,
    onDone: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ModalOverlay)
            .clickable(
                indication = null,
                interactionSource = remember { MutableInteractionSource() },
                onClick = {}
            )
            .padding(horizontal = 24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .widthIn(max = 306.dp)
                .clip(RoundedCornerShape(4.dp))
                .background(Color.White),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "النقل ناجح!",
                    color = PrimaryText,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Normal
                )

                Spacer(modifier = Modifier.height(16.dp))

                SuccessCheckCircle(modifier = Modifier.size(68.dp))

                Spacer(modifier = Modifier.height(18.dp))

                Text(
                    text = "المستفيد: ${transaction.recipientDisplay} المبلغ المرسل: ${transaction.currency} ${transaction.amount}",
                    color = PrimaryText,
                    fontSize = 13.5.sp,
                    maxLines = 1,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "معرف المعاملة : ${transaction.id}",
                    color = PrimaryText,
                    fontSize = 13.sp,
                    maxLines = 1,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = "التاريخ والوقت : ${transaction.timestamp}",
                    color = PrimaryText,
                    fontSize = 13.5.sp,
                    maxLines = 1,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(22.dp))

                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .clickable { onToggleFavorite(transaction.id) }
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "إضافة إلى المفضلة",
                        color = if (transaction.isFavorite) PrimaryText else SecondaryText,
                        fontSize = 15.sp
                    )
                    Text(
                        text = "★",
                        color = if (transaction.isFavorite) BrandYellow else FavoriteGray,
                        fontSize = 24.sp
                    )
                }
            }

            // Full-Width Bottom Turquoise Button (50.dp)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(TransferDimens.SuccessDialogButtonHeight)
                    .background(MainTurquoise)
                    .clickable(onClick = onDone),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "تم",
                    color = Color.White,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@Composable
private fun SuccessCheckCircle(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val strokeWidth = 4.5.dp.toPx()
        drawCircle(
            color = SuccessGreen,
            radius = size.minDimension / 2f - strokeWidth / 2f,
            style = Stroke(width = strokeWidth)
        )
        val w = size.width
        val h = size.height
        val path = Path().apply {
            moveTo(w * 0.32f, h * 0.51f)
            lineTo(w * 0.44f, h * 0.63f)
            lineTo(w * 0.68f, h * 0.37f)
        }
        drawPath(
            path = path,
            color = SuccessGreen,
            style = Stroke(width = 4.8.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
        )
    }
}

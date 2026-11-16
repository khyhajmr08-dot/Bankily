package com.mauritop.transfer.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mauritop.transfer.ui.theme.BrandYellow
import com.mauritop.transfer.ui.theme.MainTurquoise
import com.mauritop.transfer.ui.theme.SlateCircleGray
import com.mauritop.transfer.ui.theme.TransferDimens

@Composable
fun TurquoiseTopBar(
    title: String,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier,
    height: Dp = TransferDimens.HeaderHeight
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height)
            .background(MainTurquoise)
            .padding(horizontal = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .align(Alignment.CenterStart)
                .size(44.dp)
                .clip(CircleShape)
                .clickable(onClick = onBackClick),
            contentAlignment = Alignment.Center
        ) {
            BackArrowIcon(color = Color.White, modifier = Modifier.size(24.dp))
        }

        Text(
            text = title,
            color = Color.White,
            fontSize = 19.sp,
            fontWeight = FontWeight.Normal
        )
    }
}

@Composable
fun BackArrowIcon(color: Color, modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        val path = Path().apply {
            moveTo(w * 0.2f, h * 0.5f)
            lineTo(w * 0.8f, h * 0.5f)
            moveTo(w * 0.55f, h * 0.25f)
            lineTo(w * 0.8f, h * 0.5f)
            lineTo(w * 0.55f, h * 0.75f)
        }
        drawPath(
            path = path,
            color = color,
            style = Stroke(width = 2.3.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
        )
    }
}

@Composable
fun QrVectorIcon(color: Color, modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val u = size.width / 36f
        val stroke = Stroke(width = 4f * u)
        // Top-left hollow square
        drawRect(color = color, topLeft = Offset(2f * u, 2f * u), size = Size(13f * u, 13f * u), style = stroke)
        // Top-right hollow square
        drawRect(color = color, topLeft = Offset(21f * u, 2f * u), size = Size(13f * u, 13f * u), style = stroke)
        // Bottom-left hollow square
        drawRect(color = color, topLeft = Offset(2f * u, 21f * u), size = Size(13f * u, 13f * u), style = stroke)
        // Crisp geometric blocks
        drawRect(color = color, topLeft = Offset(13f * u, 13f * u), size = Size(6f * u, 6f * u))
        drawRect(color = color, topLeft = Offset(19f * u, 19f * u), size = Size(6f * u, 6f * u))
        drawRect(color = color, topLeft = Offset(29f * u, 21f * u), size = Size(5f * u, 5f * u))
        drawRect(color = color, topLeft = Offset(21f * u, 29f * u), size = Size(5f * u, 5f * u))
        drawRect(color = color, topLeft = Offset(29f * u, 29f * u), size = Size(5f * u, 5f * u))
    }
}

@Composable
fun PhoneOutlineIcon(color: Color, modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        drawRoundRect(
            color = color,
            topLeft = Offset(w * 0.2f, h * 0.06f),
            size = Size(w * 0.6f, h * 0.88f),
            cornerRadius = CornerRadius(3.dp.toPx(), 3.dp.toPx()),
            style = Stroke(width = 2.dp.toPx())
        )
        drawLine(
            color = color,
            start = Offset(w * 0.2f, h * 0.18f),
            end = Offset(w * 0.8f, h * 0.18f),
            strokeWidth = 1.4.dp.toPx()
        )
        drawLine(
            color = color,
            start = Offset(w * 0.2f, h * 0.80f),
            end = Offset(w * 0.8f, h * 0.80f),
            strokeWidth = 1.4.dp.toPx()
        )
        drawCircle(
            color = color,
            radius = 1.2.dp.toPx(),
            center = Offset(w * 0.5f, h * 0.87f)
        )
    }
}

@Composable
fun UsernameBustIcon(color: Color, modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        drawCircle(
            color = color,
            radius = w * 0.17f,
            center = Offset(w * 0.5f, h * 0.32f)
        )
        val shoulders = Path().apply {
            moveTo(w * 0.18f, h * 0.84f)
            quadraticTo(w * 0.18f, h * 0.56f, w * 0.5f, h * 0.56f)
            quadraticTo(w * 0.82f, h * 0.56f, w * 0.82f, h * 0.84f)
            close()
        }
        drawPath(path = shoulders, color = color)
    }
}

@Composable
fun BankBuildingIcon(color: Color, modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        val roof = Path().apply {
            moveTo(w * 0.5f, h * 0.14f)
            lineTo(w * 0.12f, h * 0.36f)
            lineTo(w * 0.88f, h * 0.36f)
            close()
        }
        drawPath(path = roof, color = color)
        listOf(0.22f, 0.45f, 0.68f).forEach { x ->
            drawRect(
                color = color,
                topLeft = Offset(w * x, h * 0.41f),
                size = Size(w * 0.10f, h * 0.30f)
            )
        }
        drawRoundRect(
            color = color,
            topLeft = Offset(w * 0.12f, h * 0.76f),
            size = Size(w * 0.76f, h * 0.09f),
            cornerRadius = CornerRadius(1.dp.toPx(), 1.dp.toPx())
        )
    }
}

@Composable
fun FacebookCircleIcon(circleColor: Color, letterColor: Color, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(CircleShape)
            .background(circleColor),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "f",
            color = letterColor,
            fontSize = 20.sp,
            fontWeight = FontWeight.ExtraBold
        )
    }
}

@Composable
fun ContactBookVectorIcon(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        drawRoundRect(
            color = BrandYellow,
            topLeft = Offset(w * 0.1f, h * 0.12f),
            size = Size(w * 0.72f, h * 0.76f),
            cornerRadius = CornerRadius(2.dp.toPx(), 2.dp.toPx()),
            style = Stroke(width = 2.dp.toPx())
        )
        listOf(0.27f, 0.48f, 0.69f).forEach { y ->
            drawLine(
                color = BrandYellow,
                start = Offset(w * 0.74f, h * y),
                end = Offset(w * 0.92f, h * y),
                strokeWidth = 2.4.dp.toPx(),
                cap = StrokeCap.Round
            )
        }
        val handset = Path().apply {
            moveTo(w * 0.34f, h * 0.34f)
            quadraticTo(w * 0.34f, h * 0.64f, w * 0.58f, h * 0.66f)
        }
        drawPath(
            path = handset,
            color = BrandYellow,
            style = Stroke(width = 2.6.dp.toPx(), cap = StrokeCap.Round)
        )
    }
}

@Composable
fun AddMemberVectorIcon(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        drawCircle(
            color = SlateCircleGray,
            radius = w * 0.15f,
            center = Offset(w * 0.5f, h * 0.30f)
        )
        val body = Path().apply {
            moveTo(w * 0.22f, h * 0.76f)
            quadraticTo(w * 0.22f, h * 0.52f, w * 0.5f, h * 0.52f)
            quadraticTo(w * 0.78f, h * 0.52f, w * 0.78f, h * 0.76f)
            close()
        }
        drawPath(path = body, color = SlateCircleGray)
        val badgeCenter = Offset(w * 0.28f, h * 0.72f)
        val badgeRadius = w * 0.16f
        drawCircle(color = Color.White, radius = badgeRadius, center = badgeCenter)
        drawCircle(
            color = SlateCircleGray,
            radius = badgeRadius,
            center = badgeCenter,
            style = Stroke(width = 1.8.dp.toPx())
        )
        drawLine(
            color = SlateCircleGray,
            start = Offset(badgeCenter.x, badgeCenter.y - badgeRadius * 0.45f),
            end = Offset(badgeCenter.x, badgeCenter.y + badgeRadius * 0.45f),
            strokeWidth = 2.dp.toPx(),
            cap = StrokeCap.Round
        )
        drawLine(
            color = SlateCircleGray,
            start = Offset(badgeCenter.x - badgeRadius * 0.45f, badgeCenter.y),
            end = Offset(badgeCenter.x + badgeRadius * 0.45f, badgeCenter.y),
            strokeWidth = 2.dp.toPx(),
            cap = StrokeCap.Round
        )
    }
}

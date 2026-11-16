package com.mauritop.transfer

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.core.view.WindowCompat
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.mauritop.transfer.ui.dialogs.PinVerificationDialog
import com.mauritop.transfer.ui.dialogs.TransferSuccessDialog
import com.mauritop.transfer.ui.screens.BoardScreen
import com.mauritop.transfer.ui.screens.HomeScreen
import com.mauritop.transfer.ui.screens.RequestMoneyScreen
import com.mauritop.transfer.ui.screens.SendMoneyScreen
import com.mauritop.transfer.ui.screens.TransferConfirmationScreen
import com.mauritop.transfer.ui.theme.TransferAppTheme
import com.mauritop.transfer.viewmodel.TransferViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        @Suppress("DEPRECATION")
        window.statusBarColor = android.graphics.Color.WHITE
        WindowCompat.getInsetsController(window, window.decorView).isAppearanceLightStatusBars = true
        setContent {
            TransferAppTheme {
                val navController = rememberNavController()
                val viewModel: TransferViewModel = viewModel()
                val uiState by viewModel.uiState.collectAsState()

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .systemBarsPadding()
                ) {
                    NavHost(
                        navController = navController,
                        startDestination = "home"
                    ) {
                        composable("home") {
                            HomeScreen(
                                transactions = uiState.sessionTransactions,
                                onNavigateToSend = { navController.navigate("send") },
                                onNavigateToRequest = {
                                    viewModel.resetRequestForm()
                                    navController.navigate("request")
                                },
                                onNavigateToBoard = { navController.navigate("board") },
                                onPrefillSend = { phone, amount, note ->
                                    viewModel.prefillTransfer(phone, amount, note)
                                    navController.navigate("send")
                                },
                                onOpenReceipt = { tx ->
                                    viewModel.openSavedReceipt(tx)
                                    navController.navigate("confirm")
                                }
                            )
                        }

                        composable("send") {
                            SendMoneyScreen(
                                uiState = uiState,
                                onSelectMethod = viewModel::selectMethod,
                                onPhoneChange = viewModel::updatePhone,
                                onUsernameChange = viewModel::updateUsername,
                                onBankNameChange = viewModel::updateBankName,
                                onBankAccountChange = viewModel::updateBankAccount,
                                onFacebookChange = viewModel::updateFacebookAccount,
                                onAmountChange = viewModel::updateAmount,
                                onNoteChange = viewModel::updateNote,
                                onBackClick = { navController.popBackStack() },
                                onSubmitClick = {
                                    if (viewModel.validateAndProceed()) {
                                        navController.navigate("confirm")
                                    }
                                }
                            )
                        }

                        composable("request") {
                            RequestMoneyScreen(
                                uiState = uiState,
                                onSelectMethod = viewModel::selectRequestMethod,
                                onPhoneChange = viewModel::updateRequestPhone,
                                onUsernameChange = viewModel::updateRequestUsername,
                                onFacebookChange = viewModel::updateRequestFacebook,
                                onAmountChange = viewModel::updateRequestAmount,
                                onNoteChange = viewModel::updateRequestNote,
                                onBackClick = { navController.popBackStack() },
                                onSubmitClick = { viewModel.submitMoneyRequest() },
                                onDismissCompleted = {
                                    viewModel.clearCompletedRequest()
                                    navController.popBackStack()
                                }
                            )
                        }

                        composable("board") {
                            BoardScreen(
                                splitGroups = uiState.splitGroups,
                                onBackClick = { navController.popBackStack() },
                                onCreateSplitGroup = viewModel::createSplitGroup,
                                onPrefillSend = { phone, amount, note ->
                                    viewModel.prefillTransfer(phone, amount, note)
                                    navController.navigate("send")
                                }
                            )
                        }

                        composable("confirm") {
                            TransferConfirmationScreen(
                                draft = uiState.draft,
                                onBackClick = { navController.popBackStack() },
                                onCompleteClick = { viewModel.openPinDialog() }
                            )
                        }
                    }

                    if (uiState.showPinDialog) {
                        PinVerificationDialog(
                            errorText = uiState.pinError,
                            isProcessing = uiState.isProcessingPin,
                            onClose = viewModel::closePinDialog,
                            onSubmitPin = viewModel::submitPin
                        )
                    }

                    uiState.completedTransaction?.let { tx ->
                        TransferSuccessDialog(
                            transaction = tx,
                            onToggleFavorite = viewModel::toggleFavorite,
                            onDone = {
                                viewModel.completeSuccessAndReset()
                                navController.popBackStack("home", inclusive = false)
                            }
                        )
                    }
                }
            }
        }
    }
}

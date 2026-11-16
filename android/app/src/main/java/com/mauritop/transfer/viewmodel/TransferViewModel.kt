package com.mauritop.transfer.viewmodel

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import com.mauritop.transfer.model.DirectoryData
import com.mauritop.transfer.model.FeeBreakdown
import com.mauritop.transfer.model.MoneyRequestRecord
import com.mauritop.transfer.model.RecipientMethod
import com.mauritop.transfer.model.RequestDraft
import com.mauritop.transfer.model.RequestMethod
import com.mauritop.transfer.model.SplitGroup
import com.mauritop.transfer.model.SplitGroupMember
import com.mauritop.transfer.model.TransactionRecord
import com.mauritop.transfer.model.TransferDraft
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import org.json.JSONArray
import org.json.JSONObject
import java.security.SecureRandom
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale
import java.util.concurrent.atomic.AtomicInteger
import kotlin.math.roundToLong

data class TransferUiState(
    val draft: TransferDraft = TransferDraft(),
    val requestDraft: RequestDraft = RequestDraft(),
    val recipientError: String? = null,
    val amountError: String? = null,
    val requestRecipientError: String? = null,
    val requestAmountError: String? = null,
    val completedRequest: MoneyRequestRecord? = null,
    val showPinDialog: Boolean = false,
    val pinError: String? = null,
    val isProcessingPin: Boolean = false,
    val completedTransaction: TransactionRecord? = null,
    val sessionTransactions: List<TransactionRecord> = emptyList(),
    val splitGroups: List<SplitGroup> = emptyList(),
    val moneyRequests: List<MoneyRequestRecord> = emptyList()
)

class TransferViewModel(application: Application) : AndroidViewModel(application) {

    private val prefs = application.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    private val sequenceCounter = AtomicInteger(0)
    private val secureRandom = SecureRandom()

    private val _uiState = MutableStateFlow(
        TransferUiState(
            sessionTransactions = loadSavedTransactions(),
            splitGroups = loadSavedGroups(),
            moneyRequests = loadSavedRequests()
        )
    )
    val uiState: StateFlow<TransferUiState> = _uiState.asStateFlow()

    fun selectMethod(method: RecipientMethod) {
        _uiState.update {
            it.copy(
                draft = it.draft.copy(method = method),
                recipientError = null,
                amountError = null
            )
        }
    }

    fun updatePhone(value: String) {
        val digitsOnly = value.filter { it.isDigit() }
        _uiState.update {
            it.copy(draft = it.draft.copy(phone = digitsOnly), recipientError = null)
        }
    }

    fun updateUsername(value: String) {
        _uiState.update {
            it.copy(draft = it.draft.copy(username = value), recipientError = null)
        }
    }

    fun updateBankName(value: String) {
        _uiState.update {
            it.copy(draft = it.draft.copy(bankName = value))
        }
    }

    fun updateBankAccount(value: String) {
        _uiState.update {
            it.copy(draft = it.draft.copy(bankAccount = value.uppercase()), recipientError = null)
        }
    }

    fun updateFacebookAccount(value: String) {
        _uiState.update {
            it.copy(draft = it.draft.copy(facebookAccount = value), recipientError = null)
        }
    }

    fun updateAmount(value: String) {
        val normalized = value.replace(',', '.')
        _uiState.update {
            it.copy(draft = it.draft.copy(amount = normalized), amountError = null)
        }
    }

    fun updateNote(value: String) {
        _uiState.update {
            it.copy(draft = it.draft.copy(note = value))
        }
    }

    fun prefillTransfer(phone: String, amount: String, note: String = "") {
        _uiState.update {
            it.copy(
                draft = TransferDraft(
                    method = RecipientMethod.PHONE,
                    phone = phone,
                    amount = amount,
                    note = note
                ),
                recipientError = null,
                amountError = null
            )
        }
    }

    fun selectRequestMethod(method: RequestMethod) {
        _uiState.update {
            it.copy(
                requestDraft = it.requestDraft.copy(method = method),
                requestRecipientError = null,
                requestAmountError = null
            )
        }
    }

    fun updateRequestPhone(value: String) {
        val digitsOnly = value.filter { it.isDigit() }
        _uiState.update {
            it.copy(requestDraft = it.requestDraft.copy(phone = digitsOnly), requestRecipientError = null)
        }
    }

    fun updateRequestUsername(value: String) {
        _uiState.update {
            it.copy(requestDraft = it.requestDraft.copy(username = value), requestRecipientError = null)
        }
    }

    fun updateRequestFacebook(value: String) {
        _uiState.update {
            it.copy(requestDraft = it.requestDraft.copy(facebookAccount = value), requestRecipientError = null)
        }
    }

    fun updateRequestAmount(value: String) {
        val normalized = value.replace(',', '.')
        _uiState.update {
            it.copy(requestDraft = it.requestDraft.copy(amount = normalized), requestAmountError = null)
        }
    }

    fun updateRequestNote(value: String) {
        _uiState.update {
            it.copy(requestDraft = it.requestDraft.copy(note = value))
        }
    }

    fun resetRequestForm() {
        _uiState.update {
            it.copy(
                requestDraft = RequestDraft(),
                requestRecipientError = null,
                requestAmountError = null,
                completedRequest = null
            )
        }
    }

    fun submitMoneyRequest(): Boolean {
        val req = _uiState.value.requestDraft
        var recErr: String? = null
        var amtErr: String? = null

        when (req.method) {
            RequestMethod.PHONE -> {
                val p = req.phone.trim()
                if (p.isEmpty()) recErr = "الرجاء إدخال رقم الهاتف"
                else if (!p.all { it.isDigit() } || p.length < 8) {
                    recErr = "الرجاء إدخال رقم هاتف صحيح (8 أرقام على الأقل)"
                }
            }
            RequestMethod.USERNAME -> {
                if (req.username.trim().length < 3) recErr = "الرجاء إدخال اسم مستخدم صحيح"
            }
            RequestMethod.FACEBOOK -> {
                if (req.facebookAccount.trim().length < 3) recErr = "الرجاء إدخال اسم حساب فيسبوك"
            }
        }

        val amountNum = req.amount.trim().toDoubleOrNull()
        if (req.amount.trim().isEmpty()) {
            amtErr = "الرجاء إدخال المبلغ"
        } else if (amountNum == null || amountNum <= 0.0) {
            amtErr = "الرجاء إدخال مبلغ صحيح أكبر من صفر"
        }

        if (recErr != null || amtErr != null) {
            _uiState.update { it.copy(requestRecipientError = recErr, requestAmountError = amtErr) }
            return false
        }

        val instant = Instant.now()
        val localDateTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault())
        val record = MoneyRequestRecord(
            id = generateUniqueTransactionId(localDateTime),
            method = req.method,
            fromDisplay = req.payerDisplay(),
            amount = formatMruDisplay(req.amount),
            note = req.note.trim().ifEmpty { null },
            createdAt = localDateTime.format(RECEIPT_DATE_FORMATTER)
        )
        val updatedRequests = listOf(record) + _uiState.value.moneyRequests
        persistRequests(updatedRequests)
        _uiState.update {
            it.copy(
                requestRecipientError = null,
                requestAmountError = null,
                completedRequest = record,
                moneyRequests = updatedRequests
            )
        }
        return true
    }

    fun clearCompletedRequest() {
        _uiState.update { it.copy(completedRequest = null, requestDraft = RequestDraft()) }
    }

    fun validateAndProceed(): Boolean {
        val draft = _uiState.value.draft
        var recErr: String? = null
        var amtErr: String? = null

        when (draft.method) {
            RecipientMethod.PHONE -> {
                val p = draft.phone.trim()
                if (p.isEmpty()) recErr = "الرجاء إدخال رقم الهاتف"
                else if (!p.all { it.isDigit() } || p.length < 8) {
                    recErr = "الرجاء إدخال رقم هاتف صحيح (8 أرقام على الأقل)"
                }
            }
            RecipientMethod.USERNAME -> {
                if (draft.username.trim().length < 3) {
                    recErr = "الرجاء إدخال اسم مستخدم صحيح"
                }
            }
            RecipientMethod.BANK -> {
                val acc = draft.bankAccount.trim()
                if (acc.length < 6 || !acc.all { it.isLetterOrDigit() }) {
                    recErr = "الرجاء إدخال رقم حساب بنكي صحيح"
                }
            }
            RecipientMethod.FACEBOOK -> {
                if (draft.facebookAccount.trim().length < 3) {
                    recErr = "الرجاء إدخال اسم حساب فيسبوك المستلم"
                }
            }
        }

        val amountNum = draft.amount.trim().toDoubleOrNull()
        if (draft.amount.trim().isEmpty()) {
            amtErr = "الرجاء إدخال المبلغ"
        } else if (amountNum == null || amountNum <= 0.0) {
            amtErr = "الرجاء إدخال مبلغ صحيح أكبر من صفر"
        }

        _uiState.update { it.copy(recipientError = recErr, amountError = amtErr) }
        return recErr == null && amtErr == null
    }

    fun openPinDialog() {
        _uiState.update { it.copy(showPinDialog = true, pinError = null) }
    }

    fun closePinDialog() {
        _uiState.update { it.copy(showPinDialog = false, pinError = null, isProcessingPin = false) }
    }

    fun submitPin(pin: String) {
        if (_uiState.value.isProcessingPin) return

        if (pin.length < 4) {
            _uiState.update { it.copy(pinError = "الرجاء إدخال الرمز السري المكون من 4 أرقام") }
            return
        }

        if (pin != DirectoryData.ACCESS_PIN) {
            _uiState.update { it.copy(pinError = "الرمز السري غير صحيح") }
            return
        }

        _uiState.update { it.copy(isProcessingPin = true, pinError = null) }

        val instant = Instant.now()
        val systemZone = ZoneId.systemDefault()
        val localDateTime = LocalDateTime.ofInstant(instant, systemZone)
        val formattedTimestamp = localDateTime.format(RECEIPT_DATE_FORMATTER)

        val draft = _uiState.value.draft
        val existingIds = _uiState.value.sessionTransactions.mapTo(HashSet()) { it.id }
        var txId = generateUniqueTransactionId(localDateTime)
        while (existingIds.contains(txId)) {
            txId = generateUniqueTransactionId(localDateTime)
        }

        val record = TransactionRecord(
            id = txId,
            method = draft.method,
            recipientDisplay = draft.recipientDisplay(),
            amount = formatMruDisplay(draft.amount),
            currency = "MRU",
            note = draft.note.trim().ifEmpty { null },
            timestamp = formattedTimestamp,
            completedInstantEpochMs = instant.toEpochMilli(),
            zoneId = systemZone.id,
            isFavorite = false
        )

        val updatedHistory = listOf(record) + _uiState.value.sessionTransactions
        persistTransactions(updatedHistory)

        _uiState.update {
            it.copy(
                isProcessingPin = false,
                showPinDialog = false,
                completedTransaction = record,
                sessionTransactions = updatedHistory
            )
        }
    }

    fun toggleFavorite(transactionId: String) {
        _uiState.update { state ->
            val updatedList = state.sessionTransactions.map { tx ->
                if (tx.id == transactionId) tx.copy(isFavorite = !tx.isFavorite) else tx
            }
            val updatedCompleted = state.completedTransaction?.let {
                if (it.id == transactionId) it.copy(isFavorite = !it.isFavorite) else it
            }
            persistTransactions(updatedList)
            state.copy(
                sessionTransactions = updatedList,
                completedTransaction = updatedCompleted
            )
        }
    }

    fun completeSuccessAndReset() {
        _uiState.update {
            it.copy(
                completedTransaction = null,
                draft = TransferDraft()
            )
        }
    }

    fun openSavedReceipt(tx: TransactionRecord) {
        _uiState.update {
            it.copy(
                draft = TransferDraft(
                    method = tx.method,
                    phone = if (tx.method == RecipientMethod.PHONE) tx.recipientDisplay else "",
                    username = if (tx.method == RecipientMethod.USERNAME) tx.recipientDisplay else "",
                    bankAccount = if (tx.method == RecipientMethod.BANK) tx.recipientDisplay else "",
                    facebookAccount = if (tx.method == RecipientMethod.FACEBOOK) tx.recipientDisplay else "",
                    amount = tx.amount.replace(" ", ""),
                    note = tx.note ?: ""
                ),
                completedTransaction = tx,
                showPinDialog = false
            )
        }
    }

    fun createSplitGroup(name: String, totalAmount: Double, members: List<Triple<String, String, Double>>): SplitGroup {
        val instant = Instant.now()
        val localDateTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault())
        val group = SplitGroup(
            id = "GRP-${System.currentTimeMillis() % 100000}",
            name = name,
            totalAmount = totalAmount,
            members = members.map { (mName, mPhone, share) ->
                SplitGroupMember(name = mName, phone = mPhone, share = share)
            },
            createdAt = localDateTime.format(RECEIPT_DATE_FORMATTER)
        )
        val updatedGroups = listOf(group) + _uiState.value.splitGroups
        persistGroups(updatedGroups)
        _uiState.update { it.copy(splitGroups = updatedGroups) }
        return group
    }

    private fun generateUniqueTransactionId(localDateTime: LocalDateTime): String {
        val stamp = localDateTime.format(ID_STAMP_FORMATTER)
        val seq = (sequenceCounter.incrementAndGet() % 10).toString()
        val rand = String.format(Locale.US, "%04d", secureRandom.nextInt(10000))
        return "01$stamp$seq$rand"
    }

    private fun persistTransactions(list: List<TransactionRecord>) {
        val array = JSONArray()
        list.forEach { tx ->
            val obj = JSONObject().apply {
                put("id", tx.id)
                put("method", tx.method.name)
                put("recipientDisplay", tx.recipientDisplay)
                put("amount", tx.amount)
                put("currency", tx.currency)
                put("note", tx.note ?: "")
                put("timestamp", tx.timestamp)
                put("completedInstantEpochMs", tx.completedInstantEpochMs)
                put("zoneId", tx.zoneId)
                put("isFavorite", tx.isFavorite)
            }
            array.put(obj)
        }
        prefs.edit().putString(KEY_TRANSACTIONS, array.toString()).apply()
    }

    private fun loadSavedTransactions(): List<TransactionRecord> {
        val raw = prefs.getString(KEY_TRANSACTIONS, null) ?: return emptyList()
        return try {
            val array = JSONArray(raw)
            buildList {
                for (i in 0 until array.length()) {
                    val obj = array.getJSONObject(i)
                    add(
                        TransactionRecord(
                            id = obj.getString("id"),
                            method = RecipientMethod.valueOf(obj.getString("method")),
                            recipientDisplay = obj.getString("recipientDisplay"),
                            amount = obj.getString("amount"),
                            currency = obj.optString("currency", "MRU"),
                            note = obj.optString("note", "").ifEmpty { null },
                            timestamp = obj.getString("timestamp"),
                            completedInstantEpochMs = obj.optLong("completedInstantEpochMs", 0L),
                            zoneId = obj.optString("zoneId", ZoneId.systemDefault().id),
                            isFavorite = obj.optBoolean("isFavorite", false)
                        )
                    )
                }
            }
        } catch (_: Exception) {
            emptyList()
        }
    }

    private fun persistGroups(list: List<SplitGroup>) {
        val array = JSONArray()
        list.forEach { grp ->
            val membersArray = JSONArray()
            grp.members.forEach { m ->
                membersArray.put(
                    JSONObject().apply {
                        put("name", m.name)
                        put("phone", m.phone)
                        put("share", m.share)
                    }
                )
            }
            array.put(
                JSONObject().apply {
                    put("id", grp.id)
                    put("name", grp.name)
                    put("totalAmount", grp.totalAmount)
                    put("createdAt", grp.createdAt)
                    put("members", membersArray)
                }
            )
        }
        prefs.edit().putString(KEY_GROUPS, array.toString()).apply()
    }

    private fun loadSavedGroups(): List<SplitGroup> {
        val raw = prefs.getString(KEY_GROUPS, null) ?: return emptyList()
        return try {
            val array = JSONArray(raw)
            buildList {
                for (i in 0 until array.length()) {
                    val obj = array.getJSONObject(i)
                    val membersJson = obj.getJSONArray("members")
                    val members = buildList {
                        for (j in 0 until membersJson.length()) {
                            val m = membersJson.getJSONObject(j)
                            add(
                                SplitGroupMember(
                                    name = m.getString("name"),
                                    phone = m.getString("phone"),
                                    share = m.getDouble("share")
                                )
                            )
                        }
                    }
                    add(
                        SplitGroup(
                            id = obj.getString("id"),
                            name = obj.getString("name"),
                            totalAmount = obj.getDouble("totalAmount"),
                            members = members,
                            createdAt = obj.optString("createdAt", "")
                        )
                    )
                }
            }
        } catch (_: Exception) {
            emptyList()
        }
    }

    private fun persistRequests(list: List<MoneyRequestRecord>) {
        val array = JSONArray()
        list.forEach { req ->
            array.put(
                JSONObject().apply {
                    put("id", req.id)
                    put("method", req.method.name)
                    put("fromDisplay", req.fromDisplay)
                    put("amount", req.amount)
                    put("note", req.note ?: "")
                    put("createdAt", req.createdAt)
                }
            )
        }
        prefs.edit().putString(KEY_REQUESTS, array.toString()).apply()
    }

    private fun loadSavedRequests(): List<MoneyRequestRecord> {
        val raw = prefs.getString(KEY_REQUESTS, null) ?: return emptyList()
        return try {
            val array = JSONArray(raw)
            buildList {
                for (i in 0 until array.length()) {
                    val obj = array.getJSONObject(i)
                    add(
                        MoneyRequestRecord(
                            id = obj.getString("id"),
                            method = RequestMethod.valueOf(obj.getString("method")),
                            fromDisplay = obj.getString("fromDisplay"),
                            amount = obj.getString("amount"),
                            note = obj.optString("note", "").ifEmpty { null },
                            createdAt = obj.getString("createdAt")
                        )
                    )
                }
            }
        } catch (_: Exception) {
            emptyList()
        }
    }

    companion object {
        private const val PREFS_NAME = "mauritop_local_transactions"
        private const val KEY_TRANSACTIONS = "transactions_json"
        private const val KEY_GROUPS = "groups_json"
        private const val KEY_REQUESTS = "requests_json"
        private val RECEIPT_DATE_FORMATTER: DateTimeFormatter =
            DateTimeFormatter.ofPattern("dd-MM-yy HH:mm:ss", Locale.US)
        private val ID_STAMP_FORMATTER: DateTimeFormatter =
            DateTimeFormatter.ofPattern("yyMMddHHmmss", Locale.US)

        fun formatMruDisplay(raw: String): String {
            val clean = raw.replace(" ", "").replace(',', '.').trim()
            val value = clean.toDoubleOrNull() ?: return raw.trim()
            val formatted = if (value % 1.0 == 0.0) {
                value.toLong().toString()
            } else {
                String.format(Locale.US, "%.2f", value).trimEnd('0').trimEnd('.')
            }
            val parts = formatted.split('.')
            val intPart = parts[0].reversed().chunked(3).joinToString(" ").reversed()
            return if (parts.size > 1) "$intPart.${parts[1]}" else intPart
        }

        fun calculateFeeBreakdown(rawAmount: String): FeeBreakdown {
            val value = rawAmount.replace(" ", "").replace(',', '.').trim().toDoubleOrNull()
            if (value == null || value <= 100.0) {
                return FeeBreakdown(serviceFee = "0", commission = "0", tax = "0")
            }
            val fee = ((value * (2.0 / 116.0)) * 100.0).roundToLong() / 100.0
            val tax = ((fee * 0.20) * 100.0).roundToLong() / 100.0
            fun fmt(v: Double): String = if (v % 1.0 == 0.0) {
                v.toInt().toString()
            } else {
                String.format(Locale.US, "%.2f", v).trimEnd('0').trimEnd('.')
            }
            return FeeBreakdown(
                serviceFee = fmt(fee),
                commission = "0",
                tax = fmt(tax)
            )
        }
    }
}

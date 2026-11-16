package com.mauritop.transfer.model

enum class RecipientMethod(val labelAr: String) {
    PHONE("رقم الهاتف"),
    USERNAME("اسم المستخدم"),
    BANK("بنك"),
    FACEBOOK("فيسبوك")
}

enum class RequestMethod(val labelAr: String) {
    PHONE("رقم الهاتف"),
    USERNAME("اسم المستخدم"),
    FACEBOOK("فيسبوك")
}

data class DirectoryContact(
    val id: String,
    val name: String,
    val phone: String,
    val username: String,
    val facebook: String,
    val bankName: String,
    val bankAccount: String
)

data class TransferDraft(
    val method: RecipientMethod = RecipientMethod.PHONE,
    val phone: String = "",
    val username: String = "",
    val bankName: String = DirectoryData.banks.first(),
    val bankAccount: String = "",
    val facebookAccount: String = "",
    val amount: String = "",
    val note: String = ""
) {
    fun recipientDisplay(): String = when (method) {
        RecipientMethod.PHONE -> phone.trim()
        RecipientMethod.USERNAME -> username.trim()
        RecipientMethod.BANK -> bankAccount.trim()
        RecipientMethod.FACEBOOK -> facebookAccount.trim()
    }
}

data class RequestDraft(
    val method: RequestMethod = RequestMethod.PHONE,
    val phone: String = "",
    val username: String = "",
    val facebookAccount: String = "",
    val amount: String = "",
    val note: String = ""
) {
    fun payerDisplay(): String = when (method) {
        RequestMethod.PHONE -> phone.trim()
        RequestMethod.USERNAME -> username.trim()
        RequestMethod.FACEBOOK -> facebookAccount.trim()
    }
}

data class FeeBreakdown(
    val serviceFee: String,
    val commission: String,
    val tax: String
)

data class TransactionRecord(
    val id: String,
    val method: RecipientMethod,
    val recipientDisplay: String,
    val amount: String,
    val currency: String = "MRU",
    val note: String? = null,
    val timestamp: String,
    val completedInstantEpochMs: Long,
    val zoneId: String,
    val isFavorite: Boolean = false
)

data class MoneyRequestRecord(
    val id: String,
    val method: RequestMethod,
    val fromDisplay: String,
    val amount: String,
    val note: String? = null,
    val createdAt: String
)

data class SplitGroupMember(
    val name: String,
    val phone: String,
    val share: Double
)

data class SplitGroup(
    val id: String,
    val name: String,
    val totalAmount: Double,
    val members: List<SplitGroupMember>,
    val createdAt: String = ""
)

object DirectoryData {
    const val ACCESS_PIN = "1234"
    const val OWNER_NAME = "أنت"
    const val OWNER_PHONE = "32014902"

    val banks = listOf(
        "بنك موريتانيا الشعبي (BPM)",
        "البنك الوطني لموريتانيا (BNM)",
        "التجاري بنك موريتانيا (ATB)",
        "البنك الموريتاني للاستثمار (BMI)"
    )

    val contacts = listOf(
        DirectoryContact(
            id = "c1",
            name = "محمد ولد أحمد",
            phone = "31198065",
            username = "mohamed_mr",
            facebook = "Mohamed Ahmed",
            bankName = banks[0],
            bankAccount = "MR13000200010031198065"
        ),
        DirectoryContact(
            id = "c2",
            name = "فاطمة منت سالم",
            phone = "31317724",
            username = "fatima_salem",
            facebook = "Fatima Salem",
            bankName = banks[1],
            bankAccount = "MR13000400020031317724"
        ),
        DirectoryContact(
            id = "c3",
            name = "سيدي ولد المختار",
            phone = "46120984",
            username = "sidi_store",
            facebook = "Sidi Mokhtar",
            bankName = banks[2],
            bankAccount = "MR13000500080046120984"
        )
    )
}

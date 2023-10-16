const myPartner = ["neu"];
const UNILEVER = "unilever";
const PARTNER_WITH_TOKEN = [UNILEVER];
window.onload = async function () {
    const params = new URLSearchParams(window.location.search);
    const partnerParam = params.get("partner");
    const partnerLocal = localStorage.getItem("partner");
    const partner = partnerParam || partnerLocal;
    const history = params.get("redirect");
    let historyUrl = localStorage.getItem("historyUrl");
    if (history) {
        localStorage.setItem("historyUrl", history);
        historyUrl = history;
    }
    if (myPartner.includes(partner)) {
        localStorage.setItem("partner", partner);
        const node = document.createElement("img");
        node.src = `./img/${partner}.png`;
        node.alt = "logo";
        node.classList.add("logo");
        document.getElementById("logo-partner").appendChild(node);
    } else {
        localStorage.removeItem("partner");
        const node = document.createElement("img");
        node.src = "./img/logo.png";
        node.alt = "logo";
        node.classList.add("logo");
        document.getElementById("logo-partner").appendChild(node);
        const nodeBg = document.createElement("img");
        nodeBg.src = "./img/image-mobile.png";
        nodeBg.alt = "logo";
        nodeBg.classList.add("bg-login");
        document.getElementById("bg-mobile").appendChild(nodeBg);
    }
    if (PARTNER_WITH_TOKEN.includes(partner)) {
        switch (String(partner).toLowerCase()) {
            case UNILEVER: {
                const sign = params.get("sign");
                const userId = params.get("userId");
                try {
                    const accessToken = await handleRequestCustomToken({
                        sign,
                        userId
                    });
                    await handleLoginWithTokenFromUnilever({
                        customToken: accessToken,
                        redirectUrl: history,
                        userId,
                    });
                } catch (error) {
                    $(".request-custom-token-error").removeClass("hidden");
                } finally {
                    $(".fa-spinner").addClass("hidden");
                    $(".submit").removeClass("disabled").removeAttr("disabled");
                }
                break;
            }
        }
        return;
    }
    const unregisterAuthObserver = await firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            const tokenParam = localStorage.getItem("accessToken");
            const refreshToken = user.refreshToken;
            localStorage.setItem("uid", user.uid);
            localStorage.setItem("refreshToken", user.refreshToken);
            document.cookie = `token= ${tokenParam}; domain= ".utop.vn"; max-age= 3600;`;
            document.cookie = `utop_uid= ${user.uid}; domain= ".utop.vn"; max-age= 3600;`;
            document.cookie = `username= ${encodeURIComponent(user.displayName)}; domain= ".utop.vn"; max-age= 3600;`;
            if (!tokenParam) {
                await firebase.auth().signOut().then(() => {}).catch((error) => {});
                localStorage.clear();
            }
            localStorage.removeItem("partner");
            if (historyUrl) {
                window.location.href = `${historyUrl}?token=${tokenParam}`;
            } else {
                window.location.href = `https://utop.vn/deal?token=${tokenParam}`;
            }
        }
        unregisterAuthObserver();
    });
};

function sendOTP() {
    let phone = $("#phoneNumber").val();
    $(".send-otp").addClass("disabled").attr("disabled", "disabled");
    $(".error-send-otp").addClass("hidden");
    if (/^\d{9,11}$/i.test(phone) && phone.toString().length > 8 && phone.toString().length < 12) {
        let phoneTemp = phone;
        if (phone[0] === 0 || phone[0] === "0") {
            phoneTemp = phoneTemp.slice(1, phone[phone.length]);
        }
        const result = `+84${phoneTemp}`;
        let timer = 60;
        let interval = null;
        $("#otpNum").removeAttr("disabled");
        interval = setInterval(() => {
            if (timer > 0) {
                timer--;
                document.getElementById("send-otp").innerHTML = `${timer}s`;
            } else if (timer === 0) {
                $(".send-otp").removeClass("disabled").removeAttr("disabled");
                document.getElementById("send-otp").innerHTML = "Gá»­i láº¡i mĂ£";
                clearInterval(interval);
            }
        }, 1000);
        axios({
            method: "post",
            url: REQUEST_OTP,
            headers: {
                "content-type": "application/json",
                "Api-Version": API_VERSION,
                "Ocp-Apim-Subscription-Key": OCP_APIM_SUBSCRIPTION_KEY,
                "Ocp-Apim-Trace": true,
            },
            data: {
                phoneNumber: result,
            },
        }).catch(function (error) {
            $(".error-send-otp").removeClass("hidden");
        });
    }
}

function verifyOTP() {
    let phone = $("#phoneNumber").val();
    let otp = $("#otpNum").val();
    $(".verify-otp-error").addClass("hidden");
    $(".fa-spinner").removeClass("hidden");
    $(".submit").addClass("disabled").attr("disabled", "disabled");
    if (/^\d{9,11}$/i.test(phone) && phone.toString().length > 8 && phone.toString().length < 12 && /^\d{6}$/.test(otp) && otp.toString().length === 6) {
        let phoneTemp = phone;
        if (phone[0] === 0 || phone[0] === "0") {
            phoneTemp = phoneTemp.slice(1, phone[phone.length]);
        }
        const result = `+84${phoneTemp}`;
        axios({
            method: "post",
            url: VERIFY_OTP,
            headers: {
                "content-type": "application/json",
                "Api-Version": API_VERSION,
                "Ocp-Apim-Subscription-Key": OCP_APIM_SUBSCRIPTION_KEY,
                "Ocp-Apim-Trace": true,
            },
            data: {
                phoneNumber: result,
                otpCode: otp,
            },
        }).then(async function (response) {
            let tokenParam = null;
            let refreshToken = null;
            if (response.status === 200) {
                const customToken = response.data.accessToken.toString();
                await firebase.auth().signInWithCustomToken(customToken).then(function (result) {
                    tokenParam = customToken;
                    localStorage.setItem("accessToken", customToken);
                    refreshToken = result.user.refreshToken;
                    localStorage.setItem("refreshToken", result.user.refreshToken);
                    document.cookie = `token= ${customToken}; domain= ".utop.vn"; max-age= 3600;`;
                    localStorage.setItem("uid", result.user.uid);
                    document.cookie = `utop_uid= ${result.user.uid}; domain= ".utop.vn"; max-age= 3600;`;
                    document.cookie = `username= ${encodeURIComponent(result.user.displayName)}; domain= ".utop.vn"; max-age= 3600;`;
                });
            }
            return {
                tokenParam,
                refreshToken
            };
        }).then(function ({
            tokenParam,
            refreshToken
        }) {
            localStorage.removeItem("partner");
            const history = localStorage.getItem("historyUrl");
            if (history) {
                window.location.replace(`${history}?token=${tokenParam}`);
            } else {
                window.location.href = `https://utop.vn/deal?token=${tokenParam}`;
            }
        }).catch(function (error) {
            if (error ? .response && error ? .response ? .data ? .Message === "VerifyOTPFail") {
                $(".otp-control").addClass("error-info");
                $(".otp-error").removeClass("hidden");
            } else {
                $(".verify-otp-error").removeClass("hidden");
            }
        }).finally(function () {
            $(".fa-spinner").addClass("hidden");
            $(".submit").removeClass("disabled").removeAttr("disabled");
        });
    }
}
const handleRequestCustomToken = async ({
    sign,
    userId
}) => {
    try {
        const response = await axios({
            method: "post",
            url: REQUEST_CUSTOM_TOKEN,
            headers: {
                "content-type": "application/json",
                "Api-Version": API_VERSION,
                "Ocp-Apim-Subscription-Key": OCP_APIM_SUBSCRIPTION_KEY_FOR_ISSUE_TOKEN,
                "Ocp-Apim-Trace": true,
            },
            data: {
                sign,
                userId,
            },
        });
        return response.data.accessToken;
    } catch (err) {
        throw err;
    }
};
const handleOnLoginSuccess = ({
    customToken,
    redirectUrl,
    userId
}) => {
    localStorage.removeItem("partner");
    window.location.replace(`${redirectUrl}?token=${customToken}&userId=${userId}`);
};
const handleLoginWithTokenFromUnilever = async ({
    customToken,
    redirectUrl,
    userId
}) => {
    if (!customToken) {
        return;
    }
    try {
        const result = await firebase.auth().signInWithCustomToken(customToken);
        localStorage.setItem("accessToken", customToken);
        localStorage.setItem("refreshToken", result.user.refreshToken);
        localStorage.setItem("uid", result.user.uid);
        document.cookie = `token= ${customToken}; domain= ".utop.vn"; max-age= 3600;`;
        document.cookie = `utop_uid= ${result.user.uid}; domain= ".utop.vn"; max-age= 3600;`;
        document.cookie = `username= ${encodeURIComponent(result.user.displayName)}; domain= ".utop.vn"; max-age= 3600;`;
        handleOnLoginSuccess({
            customToken,
            redirectUrl,
            userId
        });
    } catch (err) {
        console.error(err);
    }
};
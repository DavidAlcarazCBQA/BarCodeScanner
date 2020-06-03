({
    getBarCode: function (cmp, evt, result) {
        $A.util.removeClass(cmp.find('_barCode'), "slds-hide");
        var barCode = 'NULL';
        if (result.data != undefined) {
            var _result = JSON.parse(result.data);
            try {
                barCode = _result.codeResult.code;
            } catch (e) {
                console.log('result is ', _result);
                this.throwErrorForKicks(cmp);
            }
        } else {
            this.throwErrorForKicks(cmp);
        }
        cmp.set('v.barCode', barCode);
        $A.util.addClass(cmp.find('_spinner'), "slds-hide");
    },

    throwErrorForKicks: function (cmp) {
        var elements = document.getElementsByClassName("slds-text-error--small slds-text-align--center slds-hide");
        elements[0].style.display = 'block';
        // this sample always throws an error to demo try/catch
        var hasPerm = false;
        try {
            if (!hasPerm) {
                throw new Error("Something was wrong with the image, please upload again or take another one");
            }
        }
        catch (e) {
            $A.createComponents([
                ["ui:message", {
                    "title": "Image decoding error",
                    "severity": "error",
                }],
                ["ui:outputText", {
                    "value": e.message
                }]
            ],
                function (components, status, errorMessage) {
                    if (status === "SUCCESS") {
                        var message = components[0];
                        var outputText = components[1];
                        // set the body of the ui:message to be the ui:outputText
                        message.set("v.body", outputText);
                        var errorMessage = cmp.find("errorMessage");
                        // Replace div body with the dynamic component
                        errorMessage.set("v.body", message);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.")
                        // Show offline error
                    }
                    else if (status === "ERROR") {
                        console.log("Error: " + errorMessage);
                        // Show error message
                    }
                }
            );
        }
    }
})
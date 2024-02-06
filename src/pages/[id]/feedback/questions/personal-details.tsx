import { useEffect, useState, useContext } from "react";
import { ContextApplication } from "@/context";
import {Button, BackLink} from "@/components/button"
import Details from "@/components/details";
import Input from "@/components/input";
import Validation from "@/components/validation"
import Checkbox from "@/components/checkbox";
import { descriptionDetail } from "../../../../../util/descriptionDetail";
import { messageError, optionalValidation, isErrorValidation, isConsentValidation, isOptionValidation, postcodeMessageError, emailValidation, phoneValidation, postcodeValidation } from "../../../../../util/feedbackHelper";

const PersonalDetails = () => {
    const { onChangeQuestion, setQuestion, selectedCheckbox, personalDetailsForm, setPersonalDetailsForm } = useContext(ContextApplication);
    const [isError, setIsError] = useState<boolean>(false)
    const [isNameError, setIsNameErros] = useState<boolean>(false)
    const [isAddressError, setIsAddressErros] = useState<boolean>(false)
    const [isPostcodeError, setIsPostcodeErros] = useState<boolean>(false)
    const [isEmailError, setIsEmailErros] = useState<boolean>(false)
    const [isPhoneError, setIsPhoneErros] = useState<boolean>(false)
    const [isConsentError, setIsConsentErros] = useState<boolean>(false)
    const [generalMessage, setGeneralMessage] = useState<any>('')
    const [invalidPostcodeMessage, setInvalidPostcodeMessage] = useState<any>('')
    const [optionalValidationMessage, setOptionalValidationMessage] = useState<any>('')
    const [consentErrorMessage, setConsentErrorMessage] = useState<any>('')
    
    const backComponent = selectedCheckbox && selectedCheckbox[selectedCheckbox?.length - 1]

    useEffect(() => {
        
    const initialValueName = localStorage.getItem("name") || ''
    const initialValueAddress = localStorage.getItem("address") || ''
    const initialValueEmail = localStorage.getItem("email") || ''
    const initialValuePhone = localStorage.getItem("phone") || ''
    const initialValuePostcode = localStorage.getItem("postcode") || ''
    const consentStorageValue = localStorage.getItem("consent")
    let initialValueConsent = false
    if(consentStorageValue !== null) initialValueConsent = JSON.parse(consentStorageValue) || false

    setPersonalDetailsForm({
        name: initialValueName,
        address: initialValueAddress,
        email: initialValueEmail,
        phone: initialValuePhone,
        postcode: initialValuePostcode,
        consent: initialValueConsent
    })

}, [setPersonalDetailsForm])

const onChangeDetails = (value: any, key: string) => {
    setPersonalDetailsForm({...personalDetailsForm, [key]: value})
    localStorage.setItem(key, value)

}


const nextPage = () => {
    const errorValidation = isErrorValidation(personalDetailsForm) 
    const errorConsent = isConsentValidation(personalDetailsForm)
    const optionValidation = isOptionValidation(personalDetailsForm);

    if(errorValidation && errorConsent && optionValidation) {
        setIsError(false)
        onChangeQuestion()
    } else {
    setIsError(true)
    personalDetailsForm?.name == '' ? setIsNameErros(true) : setIsNameErros(false)
    personalDetailsForm?.address == '' ? setIsAddressErros(true) : setIsAddressErros(false)
    setGeneralMessage(messageError(personalDetailsForm))
    !postcodeValidation(personalDetailsForm?.postcode) ? setIsPostcodeErros(true) : setIsPostcodeErros(false)
    setInvalidPostcodeMessage(postcodeMessageError(personalDetailsForm))
    !emailValidation(personalDetailsForm?.email) ? setIsEmailErros(true) : setIsEmailErros(false)
    !phoneValidation(personalDetailsForm?.phone) ? setIsPhoneErros(true) : setIsPhoneErros(false)
    setOptionalValidationMessage(optionalValidation(personalDetailsForm))
    !personalDetailsForm['consent'] ? setIsConsentErros(true) : setIsConsentErros(false)
    setConsentErrorMessage(!personalDetailsForm['consent'] && `you need to check the consent box`)

}
}

    return(
        <section className="wrap-personal-details">
        <BackLink content='Back'onClick={() => setQuestion(backComponent)}/>
        <h1 className="govuk-heading-l" >Your details</h1>
        <Input label="Name" onChange={(value: any) => onChangeDetails(value, 'name')} value={personalDetailsForm?.name} type='text' 
            isError={isNameError} messageError="Your name is required"/>
        <Input label="Address" onChange={(value: any) => onChangeDetails(value, 'address')} value={personalDetailsForm?.address} type='text' 
            isError={ isAddressError} messageError="Your address is required"/>
        <Input label="Postcode" onChange={(value: any) => onChangeDetails(value, 'postcode')} value={personalDetailsForm?.postcode} type='text' 
            isError={ isPostcodeError} messageError={`${personalDetailsForm?.postcode == '' ? 'Your postcode is required' : 'Invalid postcode'}`}/> 
        <Input label="Email address" hint="Optional" onChange={(value: any) => onChangeDetails(value, 'email')} value={personalDetailsForm?.email} type='email' 
            isError={ isEmailError} messageError="Invalid email"/>
        <Input label="Telephone number" hint="Optional" onChange={(value: any) => onChangeDetails(value, 'phone')} value={personalDetailsForm?.phone} type='tel' 
            isError={ isPhoneError} messageError="Invalid telephone number"/>
        <div >
        <Checkbox labelClass='consent-label' 
        isError= {isConsentError}
        messageError='You need to consent'
        label='I consent to Lambeth Council using my data for the purposes of assessing this planning application' 
        id='consent' 
        onChange={(e) => onChangeDetails(e.target.checked, 'consent')} checked={personalDetailsForm?.consent}/>
        </div>
        {
            (isError) && <Validation 
            message={generalMessage} 
            invalidPostCode={invalidPostcodeMessage} 
            optionalValidation={optionalValidationMessage}
            consentError={consentErrorMessage}
            />   
        }

        <Details summary="How we handle your data" description={descriptionDetail['consent']} />
        <Button content="Next" onClick={() => nextPage()}/>
        </section>
        )
}

export default PersonalDetails;
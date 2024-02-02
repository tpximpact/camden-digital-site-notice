import { useEffect, useState, useContext } from "react";
import { ContextApplication } from "@/context";
import {Button, BackLink} from "@/components/button"
import Details from "@/components/details";
import Input from "@/components/input";
import Validation from "@/components/validation"
import Checkbox from "@/components/checkbox";
import { descriptionDetail } from "../../../../../util/description_detail";
import { phoneRegex, postCodeRegex } from "../../../../../util/regex";

const PersonalDetails = () => {
    const { onChangeQuestion, setQuestion, selectedCheckbox, personalDetailsForm, setPersonalDetailsForm } = useContext(ContextApplication);
    const [isError, setIsError] = useState<boolean>(false)
    const [isConsentError, setIsConsentError] = useState<boolean>(false)
    
    const backComponent = selectedCheckbox && selectedCheckbox[selectedCheckbox?.length - 1]

    useEffect(() => {
        
        const initialValueName = localStorage.getItem("name") || ''
        const initialValueAddress = localStorage.getItem("address") || ''
        const initialValueEmail = localStorage.getItem("email") || ''
        const initialValuePhone = localStorage.getItem("phone") || ''
        const initialValuePostcode = localStorage.getItem("postcode") || ''
        const initialValueConsent = Boolean(localStorage.getItem("consent")) || false

        setPersonalDetailsForm({
            name: initialValueName,
            address: initialValueAddress,
            email: initialValueEmail,
            phone: initialValuePhone,
            postcode: initialValuePostcode,
            consent: initialValueConsent
        })

    }, [setPersonalDetailsForm])

    const onChangeDetails = (value:any, key:any) => {
        setPersonalDetailsForm({...personalDetailsForm, [key]: value})
        localStorage.setItem(key, value)
        }

    const nextPage = () => {
        const nameForm = personalDetailsForm['name'];
        const addressForm = personalDetailsForm['address']
        const postcodeForm = personalDetailsForm['postcode'];
        const phoneForm = personalDetailsForm['phone'];
        const emailForm = personalDetailsForm['email'];
        const consentForm = personalDetailsForm['consent'];


        if(nameForm !== "" && postCodeRegex.test(postcodeForm) && addressForm !== "") {
            const phoneValidation = phoneForm !== "" ? phoneRegex.test(phoneForm) : true
            const emailValidation = emailForm !== "" ? emailForm.includes('@'): true
            if(phoneValidation && emailValidation) {
                onChangeQuestion()
            } else {
                setIsError(true)
            }
                setIsError(false)
        } else {
            setIsError(true)
        }

            consentForm === false ? setIsConsentError(true) : setIsConsentError(false)
        }

    return(
        <section className="wrap-personal-details">
        <BackLink content='Back'onClick={() => setQuestion(backComponent)}/>
        <h1 className="govuk-heading-l" >Your details</h1>
        <Input label="Name" onChange={(value: any) => onChangeDetails(value, 'name')} value={personalDetailsForm?.name} type='text'/>
        <Input label="Address" onChange={(value: any) => onChangeDetails(value, 'address')} value={personalDetailsForm?.address} type='text'/>
        <Input label="Postcode" onChange={(value: any) => onChangeDetails(value, 'postcode')} value={personalDetailsForm?.postcode} type='text'/>
        <Input label="Email address" hint="Optional" onChange={(value: any) => onChangeDetails(value, 'email')} value={personalDetailsForm?.email} type='email'/>
        <Input label="Telephone number" hint="Optional" onChange={(value: any) => onChangeDetails(value, 'phone')} value={personalDetailsForm?.phone} type='tel'/>
        <div >
        <Checkbox labelClass='consent-label' 
        label='I consent to Lambeth Council using my data for the purposes of assessing this planning application' 
        id='consent' 
        onChange={(e) => {setPersonalDetailsForm({...personalDetailsForm, consent: e.target.checked}), localStorage.setItem('consent', e.target.checked)}} checked={personalDetailsForm?.consent}/>
        </div>
        {
            isError && <Validation message='Name, address and postcode can not be empty'/>   
        }
        {
            isConsentError && <Validation message='You need to check the consent box'/>   
        }
        <Details summary="How we handle your data" description={descriptionDetail['consent']} />
        <Button content="Next" onClick={() => nextPage()}/>
        </section>
        )
}

export default PersonalDetails;
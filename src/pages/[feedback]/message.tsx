/* eslint-disable react/no-unescaped-entities */
import Link from "next/link"
import Button from "@/components/button"

const FeedbackMessage = () => {
    return(
        <section>
        <h1 className="govuk-heading-l">Your comment has been submitted</h1>
        <Button content="Sign up for updates about this application"/>
        <h2 className="govuk-heading-m">What’s next for this application?</h2>
        <Link href="#" style={{color: "#1D70B8"}} className="govuk-body-s">Find out more about the planning process</Link>
        <div className="process-grid">
                <p className="govuk-body-s govuk-!-font-weight-bold process-blue-title">Consultation</p>
                <p className="govuk-body-s"><span className="process-white-info govuk-!-font-weight-bold">IN PROGRESS</span></p>
                <p className="govuk-body-s">21 days left</p>
                <p className="govuk-body-s govuk-!-font-weight-bold process-blue-title" style={{gridColumnStart: "1"}}>Formal assessment</p>
                <p className="govuk-body-s"><span className="process-blue-info govuk-!-font-weight-bold">UP NEXT</span></p>
        </div>
        <h2 className="govuk-heading-m">Get involved in Lambeth's Local Plan</h2>
        <p className="govuk-body-s">You can have a big impact on developments in your local community by getting involved in Lambeth's Local Plan. </p>
        <div className="wrap-mesage-button">
            <Link href="#" className="govuk-button govuk-button--secondary">Get involved in the local plan</Link>
            <Link href="#" className="govuk-body-s govuk-!-font-weight-bold">What is a Local Plan?</Link>
        </div>
        </section>
    )
}

export default FeedbackMessage
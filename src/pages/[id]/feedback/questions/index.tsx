import { useState } from "react"
import Feeling from "./feelings"
import Impact from "./impact"
import Message from "../message"
import Comment from "./comment"
import PersonalDetails from "./personal-details"
import {addFeedback} from "../../../../../util/client"
import { CommentForm, PersonalDetailsForm, FeedbackQuestionType } from "../../../../../util/type"
import FeedbackInformation from "./feedback-information"
import CheckAnswers from "./check-answers"

const FeedbackQuestions = ({
    question, 
    setQuestion,
    onChangeQuestion, 
    selectedCheckbox, 
    setSelectedCheckbox, 
    label}: 
    FeedbackQuestionType) => {

        const [feelingForm, setFeelingForm] = useState<string>("")
        const [commentForm, setCommentForm] = useState<CommentForm>({})
        const [personalDetailsForm, setPersonalDetailsForm] = useState<PersonalDetailsForm>({name: "", address: "", email: "", phone: "", postcode:"", consent: false})

        const submit = () => {
            // submit feedback form function
            onChangeQuestion()
            addFeedback({feelingForm, commentForm, personalDetailsForm})
            localStorage.removeItem('feeling')
            localStorage.removeItem('impact')
            localStorage.removeItem('comment')
            localStorage.removeItem('name')
            localStorage.removeItem('address')
            localStorage.removeItem('postcode')
            localStorage.removeItem('email')
            localStorage.removeItem('phone')
            localStorage.removeItem('consent')
        }

        const switchComponent = () => {
            switch (question) {
                case 0:
                    return <FeedbackInformation onChange={() => onChangeQuestion()} />
                case 1:
                    return <Feeling onChange={() => onChangeQuestion()} feelingForm={feelingForm} setFeelingForm={setFeelingForm}/>
                case 2:
                    return <Impact 
                        onChange={() => onChangeQuestion()} 
                        selectedCheckbox={selectedCheckbox} 
                        setSelectedCheckbox={setSelectedCheckbox} 
                        setQuestion={setQuestion}
                        />
                case 11:
                    return <PersonalDetails 
                            onChange={() => onChangeQuestion()} 
                            personalDetailsForm={personalDetailsForm} 
                            setPersonalDetailsForm={setPersonalDetailsForm} 
                            setQuestion={setQuestion} 
                            selectedCheckbox={selectedCheckbox}/>
                case 12:
                    return <CheckAnswers 
                            onChange={() => submit()} 
                            setQuestion={setQuestion}
                            commentForm={commentForm}
                            personalDetailsForm={personalDetailsForm} 
                            setSelectedCheckbox={setSelectedCheckbox}
                            selectedCheckbox={selectedCheckbox}
                            
                            />
                case 13:
                    return <Message />
                default:
                    return <Comment 
                            onChange={() => onChangeQuestion()} 
                            label={label} 
                            commentForm={commentForm} 
                            setCommentForm={setCommentForm} 
                            setQuestion={setQuestion} 
                            selectedCheckbox={selectedCheckbox}
                            question={question} />
                }
        }

    return(
        <section className="wrap-feedback-question">
            {switchComponent()}
        </section>
    )
}

export default FeedbackQuestions
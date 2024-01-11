export const Button = ({content, icon, className, onClick, iconClass}:{iconClass?:string, content:string, icon?:React.ReactNode, className?:string, onClick?:() => void}) => {
    return(
        <button className={`govuk-button ${className}`} data-module="govuk-button" onClick={onClick}>
            {content}
            {icon && <span style={{marginLeft: '10px', verticalAlign: "middle"}} className={`${iconClass}`}>{icon}</span>}
        </button>
    )
}


export const BackLink = ({content, onClick}:{content:string, onClick?:() => void}) => {
    return(
        <button className={`govuk-back-link`} data-module="govuk-button" onClick={onClick} style={{border: 'none', backgroundColor: 'white'}}>
            {content}
        </button>
    )
}
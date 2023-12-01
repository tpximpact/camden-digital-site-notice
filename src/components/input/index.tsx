const Input = ({label, hint}:{label: string, hint?: string}) => {
    return (
        <div className="govuk-form-group">
        <h1 className="govuk-label-wrapper">
          <label className="govuk-label govuk-label--m" htmlFor="event-name" role="definition">
              {label}
          </label>
        </h1>
        {
          hint && <div id="event-name-hint" className="govuk-hint">
          {hint}
        </div>
        }
        <input className="govuk-input" id="event-name" name="eventName" type="text" role="textbox"/>
      </div>
    )
}

export default Input
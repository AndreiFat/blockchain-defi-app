function TextSideBySide(props) {
    return (
        <>
            <div className={"d-flex justify-content-between align-items-center my-4"}>
                <p className="mb-0 text-light">
                    {props.text ? `${props.text}` : ''}
                </p>
                <p className="mb-0">
                    {props.moneyAmount ? `${new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    }).format(props.moneyAmount)}` : '$0'}
                </p>
            </div>
        </>
    )
}

export default TextSideBySide
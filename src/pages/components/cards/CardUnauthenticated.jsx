function CardUnauthenticated(props) {
    return (
        <>
            <div className="card border-0 rounded-3 bg-secondary-subtle" data-bs-theme={"dark"}>
                <div className="card-body">
                    No data to be loaded. You are not signed in!
                </div>
            </div>
        </>
    )
}

export default CardUnauthenticated;
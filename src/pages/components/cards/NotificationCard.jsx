function NotificationCard(props) {
    return (
        <>
            <div className="card border-0 rounded-4 bg-secondary-subtle p-1 p-lg-2 mb-4" data-bs-theme={"dark"}>
                <div className="card-body">
                    <div className={"d-flex justify-content-between align-items-center"}>
                        <div className={"me-2 me-lg-3"}>
                            <img src={props.href} height={64} alt=""/>
                        </div>
                        <div>
                            <h6>{props.notificationTitle}</h6>
                            <p className="mb-0 text-light fs-7">{props.notificationDescription}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotificationCard
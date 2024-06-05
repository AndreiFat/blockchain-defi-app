import Link from "next/link";

export default function AuthLayout({children}) {
    return (
        <>
            <div className="auth-background-image d-flex justify-content-center">
                <div>
                    <div className={"d-flex justify-content-center my-4 py-5"}>
                        <Link href={"/"}><img src="/assets/Logo.svg" height={100} width={100} alt=""/></Link>
                    </div>
                    <main className={"position-absolute top-50 start-50 translate-middle"}>{children}</main>
                </div>
            </div>
        </>
    )
}
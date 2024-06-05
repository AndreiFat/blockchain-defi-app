import {useRouter} from "next/router";
import MainLayout from "@/pages/components/MainLayout";

const Transaction = () => {
    const router = useRouter();
    const {id} = router.query; // Get the dynamic parameter from the route

    return (
        <div>
            <h1>Transaction Details</h1>
            <p>Transaction ID: {id}</p>
            {/* Add more details about the transaction here */}
        </div>
    );
};

Transaction.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};

export default Transaction;
import MainLayout from "@/pages/components/MainLayout";

const Index = () => {
    return (
        <div>
            Savings
        </div>
    );
};

Index.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};

export default Index;
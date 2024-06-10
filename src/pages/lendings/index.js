import MainLayout from "@/components/MainLayout";

const Index = () => {
    return (
        <div>
            <div className={"my-4"}>Comming Soon...</div>
        </div>
    );
};

Index.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};

export default Index;
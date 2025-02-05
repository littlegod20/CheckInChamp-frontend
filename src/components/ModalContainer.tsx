

const ModalContainer = ({
  children,
}: {
  children: React.ReactNode;
  outClick?: boolean;
}) => {

  return (
    <section className="fixed inset-0 h-screen flex items-center justify-center z-50 w-full p-5 overflow-scroll">
      <div className="fixed inset-0 flex bg-black bg-opacity-50 items-center justify-center z-50 w-full p-5 pt-32 sm:pt-5 overflow-scroll">
        {children}
      </div>
    </section>
  );
};

export default ModalContainer;

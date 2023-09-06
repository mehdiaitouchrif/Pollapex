import { IoMdClose } from "react-icons/io";

const Modal = ({ isOpen, onClose, children }) => {
  const modalClasses = isOpen ? "block" : "hidden";

  const handleModalClick = (e) => {
    // Prevent closing the modal if the click is within the modal content
    e.stopPropagation();
  };

  const iconStyle = {
    strokeWidth: "1",
    fontSize: "1.6rem",
  };
  return (
    <div
      className={`fixed z-50 inset-0 bg-black bg-opacity-50 ${modalClasses}`}
      onClick={onClose}
    >
      <div className='fixed inset-0 flex items-center justify-center z-50 '>
        <div
          className='bg-white rounded-lg shadow-lg p-2 md:p-4 relative max-w-3xl mx-3 md:mx-auto w-full'
          onClick={handleModalClick}
        >
          <button
            className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer'
            onClick={onClose}
          >
            <IoMdClose style={iconStyle} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

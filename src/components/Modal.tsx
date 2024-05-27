type PropTypes = {
  onConfirm: () => void;
  title: string;
  content: string;
  onClose: () => void;
};

export default function Modal({
  onClose,
  onConfirm,
  title,
  content,
}: PropTypes) {
  return (
    <>
      {/* Modal xác nhận chặn tài khoản */}
      <div className="overlay">
        <div className="modal-custom">
          <div className="modal-title">
            <h4>{title ? title : "Tiêu đề"}</h4>
            <i onClick={onClose} className="fa-solid fa-xmark" />
          </div>
          <div className="modal-body-custom">
            <span>{content}</span>
          </div>
          <div className="modal-footer-custom">
            <button onClick={onClose} className="btn btn-light">
              Hủy
            </button>
            <button onClick={onConfirm} className="btn btn-danger">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

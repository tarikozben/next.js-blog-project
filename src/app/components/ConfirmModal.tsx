interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button 
            onClick={onCancel}
            className="cancel-btn"
          >
            Hayır
          </button>
          <button 
            onClick={onConfirm}
            className="confirm-btn"
          >
            Evet
          </button>
        </div>
      </div>
    </div>
  );
}
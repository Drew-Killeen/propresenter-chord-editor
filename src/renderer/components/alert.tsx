export default function Alert({
  children,
  alertLabel = 'Alert',
  buttonLabel,
  onClose,
}: {
  children: string;
  alertLabel?: string;
  buttonLabel: string;
  onClose: () => void;
}) {
  return (
    <div className="alert">
      <div className="alert-header header">{alertLabel}</div>
      <div className="alert-content">
        <div>{children}</div>
        <button type="button" onClick={onClose}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

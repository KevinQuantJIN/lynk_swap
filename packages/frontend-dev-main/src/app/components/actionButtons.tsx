interface ActionButtonsProps {
  handleApprove: () => void;
  handleSwap: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ handleApprove, handleSwap }) => (
  <div>
    <button 
      onClick={handleApprove} 
      className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition duration-300 mb-4"
    >
      Approve
    </button>

    <button 
      onClick={handleSwap} 
      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
    >
      Swap
    </button>
  </div>
);

export default ActionButtons;
import React from "react";
import { WidgetBase } from "./Dashboard";
import { Modal } from "../Modal";
import { Button } from "../ui/Button";

interface WidgetSelectionModalProps<T extends WidgetBase> {
  availableWidgets: T[];
  onAddWidget: (widget: T) => void;
  isOpen: boolean;
  onClose: () => void;
}

const WidgetSelectionModal = <T extends WidgetBase>({
  availableWidgets,
  onAddWidget,
  isOpen,
  onClose,
}: WidgetSelectionModalProps<T>) => {
  if (!isOpen) return null;

  return (
    <Modal title="Select a Widget to Add" onClose={onClose} isOpen={isOpen}>
      <ul className=" pt-2 flex flex-col gap-2">
        {availableWidgets.map((widget) => (
          <li key={widget.id}>
            <Button
              variant="subtle"
              size="small"
              className="px-0"
              onClick={() => {
                onAddWidget(widget);
                onClose();
              }}
            >
              {widget.id}
            </Button>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default WidgetSelectionModal;

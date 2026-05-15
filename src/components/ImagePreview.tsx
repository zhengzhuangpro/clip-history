import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { blobToDataUrl } from "@/lib/utils";
import { useTranslation } from "@/i18n";

interface ImagePreviewProps {
  blob: Uint8Array | null;
  open: boolean;
  onClose: () => void;
}

export function ImagePreview({ blob, open, onClose }: ImagePreviewProps) {
  const { t } = useTranslation();
  if (!blob) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="sr-only">{t("image_preview")}</DialogTitle>
        <img
          src={blobToDataUrl(blob)}
          alt="preview"
          className="max-h-[70vh] w-full object-contain rounded"
        />
      </DialogContent>
    </Dialog>
  );
}

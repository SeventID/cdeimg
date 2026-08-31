import { useState, useRef, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { LogOut, Upload, Copy, Check, FileImage, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded border border-border px-2 py-1 text-[10px] text-muted-foreground transition hover:border-primary/50 hover:text-primary"
    >
      {copied ? (
        <>
          <Check className="size-3 text-primary" />
          copied
        </>
      ) : (
        <>
          <Copy className="size-3" />
          copy
        </>
      )}
    </button>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);
  const files = useQuery(api.files.listFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const uploadFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadStatus(`▸ Uploading ${file.name}...`);

      try {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();

        await saveFile({
          storageId: storageId as string,
          filename: file.name,
          mimetype: file.type,
          size: file.size,
        });

        setUploadStatus(`✔ ${file.name} uploaded.`);
        setTimeout(() => setUploadStatus(null), 2500);
      } catch (err) {
        setUploadStatus(`✘ Upload failed: ${String(err)}`);
      } finally {
        setIsUploading(false);
      }
    },
    [generateUploadUrl, saveFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
      e.target.value = "";
    },
    [uploadFile]
  );

  return (
    <main className="min-h-screen bg-background text-foreground font-mono">
      {/* ── Header ── */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-sm uppercase">
            <span className="text-accent">$</span>
            <span>codeimg</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              {user?.email ?? "anon"}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-[11px] cursor-pointer border-border text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="size-3" />
              sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* ── Upload Zone ── */}
        <div className="mb-8 text-xs text-muted-foreground">
          <span className="text-primary">$</span>{" "}
          <span className="text-accent">codeimg</span>{" "}
          <span className="text-muted-foreground">--upload</span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded border-2 border-dashed p-12 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-card/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload
            className={`mx-auto mb-4 size-8 ${
              isDragging ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <p className="text-sm text-muted-foreground">
            {isDragging ? (
              <span className="text-primary">Drop to upload</span>
            ) : isUploading ? (
              <span className="text-accent">Uploading...</span>
            ) : (
              "Drag an image here, or click to browse"
            )}
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground/60">
            PNG, JPG, GIF, SVG, WebP — up to 10 MB
          </p>
        </div>

        {/* ── Status line ── */}
        <AnimatePresence>
          {uploadStatus && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded border border-border bg-card px-4 py-2.5 text-xs text-muted-foreground">
                {uploadStatus}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── File list ── */}
        <div className="mt-12 mb-6 text-xs text-muted-foreground">
          <span className="text-primary">$</span>{" "}
          <span className="text-accent">codeimg</span>{" "}
          <span className="text-muted-foreground">--list</span>
          <span className="ml-3 text-primary/60">
            {files ? `${files.length} file${files.length !== 1 ? "s" : ""}` : "loading..."}
          </span>
        </div>

        {files === undefined ? (
          <div className="rounded border border-border bg-card p-6 text-xs text-muted-foreground animate-pulse">
            Loading files...
          </div>
        ) : files.length === 0 ? (
          <div className="rounded border border-border bg-card p-8 text-center">
            <FileImage className="mx-auto mb-3 size-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              No files yet. Upload your first image above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <motion.div
                key={file._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded border border-border bg-card overflow-hidden"
              >
                <div className="flex items-start gap-4 p-4">
                  {/* Thumbnail */}
                  {file.url && (
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="size-16 rounded border border-border object-cover shrink-0"
                    />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {file.filename}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 shrink-0">
                        {formatBytes(file.size)}
                      </span>
                    </div>

                    {file.url && (
                      <div className="mt-3 space-y-2">
                        {/* Direct URL */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-muted-foreground/60 shrink-0 w-14">
                            url:
                          </span>
                          <code className="text-[11px] text-primary/80 break-all">
                            {file.url}
                          </code>
                          <CopyButton text={file.url} />
                        </div>

                        {/* Markdown embed */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-muted-foreground/60 shrink-0 w-14">
                            md:
                          </span>
                          <code className="text-[11px] text-accent/80 break-all">
                            {`![${file.filename}](${file.url})`}
                          </code>
                          <CopyButton
                            text={`![${file.filename}](${file.url})`}
                          />
                        </div>

                        {/* wget */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-muted-foreground/60 shrink-0 w-14">
                            wget:
                          </span>
                          <code className="text-[11px] text-muted-foreground break-all">
                            {`wget "${file.url}" -O ${file.filename}`}
                          </code>
                          <CopyButton
                            text={`wget "${file.url}" -O ${file.filename}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

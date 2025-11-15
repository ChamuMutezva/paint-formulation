"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, CheckCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExtractedFormulation {
    colorName: string;
    productType: string;
    baseSize: number;
    baseUnit: string;
    description?: string;
    components: Array<{
        name: string;
        quantity: number;
        unit: string;
    }>;
}

interface ImageFormulationExtractorProps {
    onExtracted: (data: ExtractedFormulation) => void;
}

export function ImageFormulationExtractor({
    onExtracted,
}: Readonly<ImageFormulationExtractorProps>) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

    const handleImageUpload = async (file: File) => {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            setError("File size must be less than 5MB");
            return;
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Only JPG and PNG files are supported");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Convert image to base64
            /*
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                const base64Image = reader.result as string;
                setPreview(base64Image);

                // Call API to extract formulation
                const response = await fetch("/api/extract-formulation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64Image }),
                });

                if (!response.ok) {
                    throw new Error("Failed to extract formulation");
                }

                const { data } = await response.json();
                onExtracted(data);
                setSuccess(true);

                // Clear preview after 2 seconds
                setTimeout(() => {
                    setPreview(null);
                    setSuccess(false);
                }, 2000);
            };

            reader.onerror = () => {
                throw new Error("Failed to read image file");
            };
            */
            // Convert image to base64
            const base64Image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () =>
                    reject(new Error("Failed to read image file"));
                reader.readAsDataURL(file);
            });

            setPreview(base64Image);

            // Call API to extract formulation
            const response = await fetch("/api/extract-formulation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image }),
            });

            if (!response.ok) {
                throw new Error("Failed to extract formulation");
            }

            const { data } = await response.json();
            onExtracted(data);
            setSuccess(true);

            // Clear preview after 2 seconds
            const timeoutId = setTimeout(() => {
                setPreview(null);
                setSuccess(false);
            }, 2000);

            // Store timeout ID for cleanup if needed
            return () => clearTimeout(timeoutId);
        } catch (err) {
            console.error("[v0] Error extracting formulation:", err);
            setError(
                "Failed to extract formulation. Please try again or enter manually."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const clearPreview = () => {
        setPreview(null);
        setError(null);
        setSuccess(false);
    };

    return (
        <Card className="border-dashed">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Extract from Image
                </CardTitle>
                <CardDescription>
                    Take a photo or upload a photo of a handwritten or printed
                    formulation to auto-fill the form
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {preview && (
                    <div className="relative">
                        <img
                            src={preview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full max-h-64 object-contain rounded-lg border"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-background/80"
                            onClick={clearPreview}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="border-green-500 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-600">
                            Formulation extracted successfully! Check the form
                            below.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        disabled={loading}
                        onClick={() =>
                            document.getElementById("camera-capture")?.click()
                        }
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Extracting...
                            </>
                        ) : (
                            <>
                                <Camera className="h-4 w-4 mr-2" />
                                Take Photo
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        disabled={loading}
                        onClick={() =>
                            document.getElementById("image-upload")?.click()
                        }
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Extracting...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Choose File
                            </>
                        )}
                    </Button>

                    <input
                        id="camera-capture"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleCameraCapture}
                        disabled={loading}
                        title="Take a photo"
                    />

                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileInput}
                        disabled={loading}
                        title="Upload image file"
                    />
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    Supports JPG, PNG. Works with handwritten and printed
                    formulations.
                </p>
            </CardContent>
        </Card>
    );
}

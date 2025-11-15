"use client";

import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareFormulationProps {
    paintName: string;
    productType: string;
    size: number;
    unit: string;
    formulations: Array<{
        component_name: string;
        quantity: number;
        unit: string;
    }>;
    customerName?: string;
}

export function ShareFormulation({
    paintName,
    productType,
    size,
    unit,
    formulations,
    customerName,
}: Readonly<ShareFormulationProps>) {
    const [copied, setCopied] = useState(false);

    const formatMessage = () => {
        let message = `🎨 Paint Formulation\n\n`;

        if (customerName) {
            message += `Customer: ${customerName}\n`;
        }

        message += `Paint: ${paintName}\n`;
        message += `Type: ${productType}\n`;
        message += `Size: ${size} ${unit}\n\n`;
        message += `Formula:\n`;

        formulations.forEach((f) => {
            message += `• ${f.component_name}: ${f.quantity.toFixed(3)} ${
                f.unit
            }\n`;
        });

        const total = formulations.reduce((sum, f) => sum + f.quantity, 0);
        message += `\nTotal: ${total.toFixed(3)} ${unit}`;

        return message;
    };

    const handleCopy = async () => {
        const message = formatMessage();
        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    const handleWebShare = async () => {
        const message = formatMessage();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${paintName} Formulation`,
                    text: message,
                });
            } catch (error) {
                // User cancelled or error occurred
                console.error("Share failed:", error);
            }
        } else {
            // Fallback to copy
            handleCopy();
        }
    };

    const handleWhatsAppShare = () => {
        const message = formatMessage();
        const encoded = encodeURIComponent(message);
        const url = `https://wa.me/?text=${encoded}`;
        window.open(url, "_blank");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleWebShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share via...
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleWhatsAppShare}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Share on WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                    {copied ? (
                        <>
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

import * as Dialog from '@radix-ui/react-dialog';

import { Button } from '../Button/Button';

import { X, Upload, Book } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { cn } from '../../lib/utils';






export function Modal({ isOpen, onClose, content, data }) {
    console.log("Content", content)

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            <Dialog.Content className={cn(
                "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md",
                "dark:bg-gray-800 dark:text-muted w-9/12"
            )}>
                <Dialog.Description>
                    <button className="text-gray-400 hover:text-gray-600 text-right w-full p-2">
                        <Dialog.Close asChild>
                            <button className={cn("rounded-full transition-colors p-1 duration-300 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground", "dark:text-gray-100 dark:bg-gray-900 dark:hover:text-gray-100 dark:hover:bg-gray-400")}>
                                <X className="h-5 w-5" />
                            </button>
                        </Dialog.Close>
                    </button>
                    <div className='p-5'>
                        {content}
                    </div>
                </Dialog.Description>
            </Dialog.Content>
        </Dialog.Root>
    );
}

'use client';
import {
    Form,
    FormMessage,
    FormControl,
    FormLabel,
    FormItem,
    FormField
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import { ScrollArea } from '@/components/scroll-area';
import { Button } from '@/components/ui/button';

interface CollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
    doAddCollection: (data: any) => void;
}

export default function CollectionModal({
    isOpen,
    onClose,
    loading,
    doAddCollection
}: CollectionModalProps) {

    const defaultValues = {
    };

    const formSchema = z.object({
        collection_code: z.string().min(1, "Collection ID is required"),
        collection_address: z.string().min(1, "Collection Address is required"),
        collection_name: z.string().min(1, "Collection Name is required"),
        collection_description: z.string().min(1, "Description is required"),
        collection_supply: z.any().refine(value => value !== null && value !== undefined && value !== '' && !isNaN(value) && value > 0, {
            message: "Required",
        }),
        // collection_image_url: z.string(),
        // collection_attr_url:  z.string(),
        // collection_banner_url: z.string(),
    });
    type FormValue = z.infer<typeof formSchema>;

    const form = useForm<FormValue>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = (data: Record<string, any>) => {
        doAddCollection(data);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95%] md:!max-w-xl rounded-xl bg-black px-4">
                <h1 className="mr-4 font-londrina text-xl text-green-500 font-bold md:text-2xl xl:text-2xl">
                    Collection:
                </h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-4"
                    >
                        <ScrollArea className='w-full h-full max-h-[60vh]'>
                            <div className="flex w-full bg-black text-white">
                                <div className="w-full flex flex-col gap-x-8 px-4">
                                    <div className="my-2">
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="collection_code"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <div className="h-1 w-1 rounded-full bg-white mr-2" /> Collection ID: <span className="text-green-500">*</span>
                                                        </FormLabel>
                                                        <div className="relative ml-auto flex-1 md:grow-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    disabled={loading}
                                                                    placeholder="oddswizard..."
                                                                    className="w-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="collection_address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <div className="h-1 w-1 rounded-full bg-white mr-2" /> Collection Address: <span className="text-green-500">*</span>
                                                        </FormLabel>
                                                        <div className="relative ml-auto flex-1 md:grow-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    disabled={loading}
                                                                    placeholder="stars..."
                                                                    className="w-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="collection_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <div className="h-1 w-1 rounded-full bg-white mr-2" /> Collection Name: <span className="text-green-500">*</span>
                                                        </FormLabel>
                                                        <div className="relative ml-auto flex-1 md:grow-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    disabled={loading}
                                                                    placeholder="Odds Wizard..."
                                                                    className="w-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="collection_description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <div className="h-1 w-1 rounded-full bg-white mr-2" /> Description: <span className="text-green-500">*</span>
                                                        </FormLabel>
                                                        <div className="relative ml-auto flex-1 md:grow-0">
                                                            <FormControl>
                                                                <Textarea
                                                                    rows={3}
                                                                    disabled={loading}
                                                                    placeholder="Dive into the magic..."
                                                                    className="w-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="collection_supply"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <div className="h-1 w-1 rounded-full bg-white mr-2" /> Supply: <span className="text-green-500">*</span>
                                                        </FormLabel>
                                                        <div className="relative ml-auto flex-1 md:grow-0">
                                                            <FormControl>
                                                                <Input
                                                                    min={1}
                                                                    type="number"
                                                                    disabled={loading}
                                                                    placeholder="2500 ..."
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </ScrollArea>
                        <div className='flex justify-end'>
                            <Button className="bg-green-500 hover:bg-green-600 text-black rounded-[10px]">Save</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
}

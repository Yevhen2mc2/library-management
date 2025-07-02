import { Book } from "@/types/book";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface IProps {
  book: Book;
}

export const BookCard = ({ book }: IProps) => {
  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : null;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="aspect-square w-40 mx-auto mb-4 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            width={160}
            height={160}
            src={coverUrl || ""}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-2">{book.title}</h3>
          <p className="text-muted-foreground">{book.author}</p>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{book.year}</span>
            <span>${book.price.toFixed(2)}</span>
          </div>
        </div>

        {/*{isAuthenticated && (*/}
        {/*  <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">*/}
        {/*    <Button*/}
        {/*      variant="outline"*/}
        {/*      size="sm"*/}
        {/*      onClick={() => onEdit(book.id)}*/}
        {/*      className="flex-1"*/}
        {/*    >*/}
        {/*      <Edit className="w-4 h-4 mr-1" />*/}
        {/*      Edit*/}
        {/*    </Button>*/}
        {/*    <AlertDialog>*/}
        {/*      <AlertDialogTrigger asChild>*/}
        {/*        <Button variant="outline" size="sm" className="flex-1">*/}
        {/*          <Trash2 className="w-4 h-4 mr-1" />*/}
        {/*          Delete*/}
        {/*        </Button>*/}
        {/*      </AlertDialogTrigger>*/}
        {/*      <AlertDialogContent>*/}
        {/*        <AlertDialogHeader>*/}
        {/*          <AlertDialogTitle>Are you sure?</AlertDialogTitle>*/}
        {/*          <AlertDialogDescription>*/}
        {/*            This action cannot be undone. This will permanently delete*/}
        {/*            the book "{book.title}".*/}
        {/*          </AlertDialogDescription>*/}
        {/*        </AlertDialogHeader>*/}
        {/*        <AlertDialogFooter>*/}
        {/*          <AlertDialogCancel>Cancel</AlertDialogCancel>*/}
        {/*          <AlertDialogAction onClick={() => onDelete(book.id)}>*/}
        {/*            Yes*/}
        {/*          </AlertDialogAction>*/}
        {/*        </AlertDialogFooter>*/}
        {/*      </AlertDialogContent>*/}
        {/*    </AlertDialog>*/}
        {/*  </div>*/}
        {/*)}*/}
      </CardContent>
    </Card>
  );
};

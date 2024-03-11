# Label your data
Drop your images in the `data/frames` folder and label them using the labeler tool. To run it, execute the following command:
```bash
./scripts/serve.sh
```
Then, open your browser and go to `http://localhost:3000/`. You will see the following screen:

![Alt text](https://i.postimg.cc/xjLhHdM1/image.png)

Its use is fairly intuitive: you can mark the image as cat/dog, or mark it to be deleted if it does not correspond to any of the two classes. You can also use the keyboard shortcuts `C` and `D` to mark the image as cat/dog, and `R` to mark it as to be deleted. Once you are done, click on `Save` (Right Arrow) to save the labels to disk and move to the next image. You can also go back to correct mistakes clicking on `Previous` (Left Arrow).
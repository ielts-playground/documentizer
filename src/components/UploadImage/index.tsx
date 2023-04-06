import React, { useEffect, useState } from 'react';

type UploadProps = {
    initialValue?: string;
    onCancel: () => void;
    onFinish: (data: string, width?: number, height?: number) => void;
};

export default function (props: UploadProps) {
    const [data, setData] = useState<string>();

    useEffect(() => {
        setData(props.initialValue);
    }, [props.initialValue]);

    const updateImage = (data: string) => {
        setData(data.toString());
    };

    const cancel = () => {
        props.onCancel();
    };

    const finish = (image: string) => {
        props.onFinish(image, 500, 300);
    };

    function convertToBase64AndRender(e) {
        {
            const file = e.currentTarget.files.item(0);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async (e) => {
                const quality = 0.01;
                const original = e.target.result.toString();
                const reduced = await reduceImage(original, quality);
                console.log(original.length, reduced.length);
                updateImage(reduced);
            };
        }
    }

    const reduceImage = (original: string, quality: number) => {
        return new Promise<string>((resolve, _) => {
            const image = document.createElement('img');
            image.src = original;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                const imageData = context.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;
                    data[i + 1] = avg;
                    data[i + 2] = avg;
                }
                context.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
        });
    };

    return (
        <>
            <div>Choose your image</div>
            <input
                type={'file'}
                onChange={(e) => convertToBase64AndRender(e)}
            />
            Preview: <img src={data} width={500} />
            <button onClick={() => cancel()}>Cancel</button>
            <button onClick={() => finish(data)}>Save</button>
        </>
    );
}

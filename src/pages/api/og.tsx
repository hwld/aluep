/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import fs from "fs";
import { NextApiHandler } from "next";
import satori from "satori";
import sharp from "sharp";

const handler: NextApiHandler = async (req, res) => {
  const { title, userName, userImage } = req.query;

  const fontMedium = fs.readFileSync("public/NotoSansJP-Medium.ttf");
  const fontBold = fs.readFileSync("public/NotoSansJP-Bold.ttf");
  const logo = fs.readFileSync("public/logo.svg");

  // svgのまま表示させようとしても消えちゃうので、一旦pngに変換する
  const logoPng = await sharp(Buffer.from(logo))
    .resize({ width: 130, height: 100 })
    .png()
    .toBuffer();
  const logoBase64 = `data:image/png;base64,${logoPng.toString("base64")}`;

  const svg = await satori(
    <div
      style={{
        display: "flex",
        backgroundColor: "#b91c1c",
        padding: "50px",
        justifyContent: "center",
        alignItems: "center",
        width: "1200px",
        height: "600px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f4",
          width: "100%",
          height: "100%",
          borderRadius: "20px",
          padding: "30px",
          justifyContent: "space-between",
        }}
      >
        <p style={{ color: "#44403c", fontSize: "50px", fontWeight: "bold" }}>
          {title}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              minWidth: 0,
              flexShrink: 1,
            }}
          >
            {userImage && (
              <img
                style={{ borderRadius: "50%" }}
                src={`${userImage}`}
                width={100}
                height={100}
              />
            )}
            <p
              style={{
                color: "#44403c",
                fontSize: "26px",
              }}
            >
              {userName}
            </p>
          </div>
          <div style={{ display: "flex", flexShrink: 0 }}>
            <img src={logoBase64} width={130} height={100} />
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "NotoSansJP",
          data: fontMedium,
          weight: 500,
          style: "normal",
        },
        {
          name: "NotoSansJP",
          data: fontBold,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const og = await sharp(Buffer.from(svg)).png().toBuffer();

  res.setHeader("Content-type", "image/png");
  res.send(og);
};

export default handler;

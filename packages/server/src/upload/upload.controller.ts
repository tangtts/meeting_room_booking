import { Body, Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ensureDir } from "fs-extra";
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @ApiOperation({
    summary: "上传头像",
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination:async function (req, file, cb) {
          // 确保有这个目录
          await  ensureDir("my-uploads");
          cb(null, path.join(process.cwd(), "my-uploads"));
        },
        filename: function (req, file, cb) {
          file.originalname = Buffer.from(file.originalname, "latin1").toString(
            "utf8"
          );
          const uniqueSuffix =
            Date.now() +
            "-" +
            file.originalname;
          cb(null, file.fieldname + "-" + uniqueSuffix);
        },
      }),
    })
  )
  @Post("upload")
  async upload(
    @Req() req: any,
    @Body() uploadDTO: any,
    @UploadedFile() file
  ) {
     // http://127.0.0.1:4396/static/file-1698651026651-20201123195328976.png
    return {
     file: req.file,
     url:`http://127.0.0.1:4396/static/${req.file.filename}`
    }
  }
}

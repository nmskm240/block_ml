import { Asset as AssetEntity } from '@prisma/client';
import Asset from './domains';

export function toDomain(entity: AssetEntity): Asset {
  return new Asset({
    id: entity.id,
    name: entity.fileName,
    path: entity.filePath,
  });
}

export function toEntity(model: Asset): AssetEntity {
  return {
    id: model.id.value,
    fileName: model.name.value,
    filePath: model.path.value,
  };
}

import { Asset as AssetEntity } from '@/lib/prisma';
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
    id: model.id,
    fileName: model.name,
    filePath: model.path,
  };
}

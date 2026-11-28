import json
from pathlib import Path

import aiofiles
import aiofiles.os


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


async def read_json(filename: str):
    path = DATA_DIR / filename

    try:
        async with aiofiles.open(
            path,
            mode="r",
            encoding="utf-8"
        ) as file:
            return json.loads(await file.read())

    except FileNotFoundError:
        if filename == "orders.json":
            return []

        raise


async def write_json(filename: str, data):
    path = DATA_DIR / filename
    temp_path = path.with_suffix(".tmp")

    async with aiofiles.open(
        temp_path,
        mode="w",
        encoding="utf-8"
    ) as file:
        await file.write(
            json.dumps(
                data,
                ensure_ascii=False,
                indent=4
            )
        )

    await aiofiles.os.replace(temp_path, path)
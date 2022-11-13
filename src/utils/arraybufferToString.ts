const ArraybufferToString = (ab: ArrayBuffer): string => new TextDecoder().decode(ab);

export default ArraybufferToString;

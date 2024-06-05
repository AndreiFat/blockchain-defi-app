export const truncateAddress = (address, startLength = 8, endLength = 8) => {
    if (!address) return '';
    const start = address.substring(0, startLength);
    const end = address.substring(address.length - endLength, address.length);
    return `${start}...${end}`;
};

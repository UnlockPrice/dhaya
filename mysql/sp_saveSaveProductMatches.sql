CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_saveProductMatches`(IN `flipkart_param` VARCHAR(50), IN `snapdeal_param` VARCHAR(50), IN `amazon_param` VARCHAR(50))
begin
    if exists (select flipkart from sepp_product_matching where flipkart=flipkart_param)
    then
        update sepp_product_matching set snapdeal = snapdeal_param, amazon = amazon_param where flipkart = flipkart_param;
    else
        insert into sepp_product_matching(flipkart,snapdeal,amazon) values(flipkart_param,snapdeal_param,amazon_param);
    end if;
end
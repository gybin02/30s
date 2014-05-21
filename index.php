<!DOCTYPE HTML>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<title>
		<?php
			if($_GET['dir']){
				echo $_GET['dir'];
			}else{
				echo 'html/';
			}
		?>
	</title>
	<style type="text/css">
		body{
			font: 16px/1.5 sans-serif;
		}
	</style>
</head>
<body>

<?php
	$getDir=$_GET['dir'];
	if (empty($getDir)){
		$getDir="../html";
	}
	$handle = scandir($getDir);
	echo '<a href="?dir='.str_replace(strrchr($getDir,"/"),'',$getDir).'"><strong>返回上一级&gt;&gt;</strong></a><br>';
	echo '<ul>';
	if ($handle) {

		for($i = 0; $i<count($handle); $i++){
			$file = $handle[$i];
			if (is_dir($getDir.'/'.$file)){
				if($file!='..' and $file!='.'){
					echo '<li><a href="?dir='.$getDir.'/'.$file.'">';
					if(strlen($file)>30){
						echo substr($file,1,30)."…";
					}else{
						echo $file;
					}
					echo '</a></li>';
				}
			}else{
				echo '<li><a href="'.$getDir.'/'.$file.'">'.$file.'</a></li>';
			}
		}  
	}
	echo '</ul>';
	closedir($handle);
?>
	<hr>
	<p>更新时间： <?php echo date("Y-m-d H:i:s"); ?></p>
</body>
</html>